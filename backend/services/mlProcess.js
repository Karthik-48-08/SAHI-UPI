const { spawn } = require('child_process');
const path = require('path');

class MLProcessManager {
  constructor() {
    this.pythonProcess = null;
    this.callbacks = new Map(); // Maps transaction_id to resolve/reject functions
    this.isReady = false;
  }

  start() {
    const scriptPath = path.join(__dirname, '..', '..', 'ml_engine', 'inference.py');
    console.log(`Starting Python ML Process at ${scriptPath}`);
    
    // Assumes python is available in PATH. You may need to change this to 'python3' depending on the environment
    this.pythonProcess = spawn('python', [scriptPath]);

    this.pythonProcess.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const result = JSON.parse(line);
          if (result.error) {
            console.error('ML Error:', result.error);
            continue;
          }
          
          const txId = result.transaction_id;
          if (this.callbacks.has(txId)) {
            const resolve = this.callbacks.get(txId);
            resolve(result);
            this.callbacks.delete(txId);
          }
        } catch (e) {
          console.error('Error parsing python output:', line, e);
        }
      }
    });

    this.pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    this.pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      this.isReady = false;
      // Optionally restart the process here
    });

    this.isReady = true;
  }

  async predict(features, transactionId) {
    if (!this.isReady || !this.pythonProcess) {
      throw new Error("ML Process is not ready");
    }

    return new Promise((resolve, reject) => {
      // Set a timeout to avoid hanging requests if python process fails to respond
      const timeout = setTimeout(() => {
        if (this.callbacks.has(transactionId)) {
          this.callbacks.delete(transactionId);
          reject(new Error("ML Inference Timeout"));
        }
      }, 1000); // 1 second timeout, goal is <200ms latency

      this.callbacks.set(transactionId, (result) => {
        clearTimeout(timeout);
        resolve(result);
      });

      const payload = { ...features, transaction_id: transactionId };
      this.pythonProcess.stdin.write(JSON.stringify(payload) + '\n');
    });
  }
}

module.exports = new MLProcessManager();

const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// API endpoint to execute kubectl commands
app.post('/api/kubectl', (req, res) => {
    const { command, namespace } = req.body;
    
    // Whitelist of allowed commands for security
    const allowedCommands = [
        'get pods', 'get services', 'get deployments', 'get nodes',
        'describe pod', 'describe service', 'describe deployment',
        'logs', 'top pods', 'top nodes', 'get events'
    ];
    
    const isAllowed = allowedCommands.some(allowed => command.startsWith(allowed));
    if (!isAllowed) {
        return res.status(403).json({ error: 'Command not allowed' });
    }

    const kubectlCmd = `kubectl ${command} ${namespace ? `-n ${namespace}` : ''}`;
    
    exec(kubectlCmd, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message, stderr });
        }
        res.json({ output: stdout });
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    console.log(`K8s Toolkit backend running on port ${port}`);
});
/* 
    Brain for the frontend application
    Codes here will be executed in the browser
    Used for DOM manipulation, event handling, and other client-side logic
*/

// Mouse movement and clicks
// Keyboard touches

class Idleness {
    constructor () {
        this.idleTime = 0;
        this.idleThreshold = 300000;
        this.lastEvent = Date.now();

        /* 
        Calling the method makes it run immediately
        This means the event listeners (mousemove, click, keydown) are attached
        right away, withouit waiting for the handleIdleEnd() method to be called manually
        */
        this.handleIdleEnd(); 
    }

    resetIdle() {
        this.idleTime = 0;
        this.lastEvent = Date.now();
        console.log("Idle reset at:", new Date().toLocaleTimeString()); // <-- debug helper
    }

    handleIdleEnd () {
        ["mousemove", "click", "keydown"].forEach(event => {
            document.addEventListener(event, this.resetIdle.bind(this));
        })
    }

    handleTimeout () {
        this.handleTimeoutWarning();
        throwLogout();
    }

    handleCheckIdleTime () {
        let totalIdle = Date.now() - this.lastEvent

        if (totalIdle >= this.idleThreshold) {
            this.handleTimeout();        
        }
    }

    handleTimeoutWarning () {
        alert("Session timeout: Please login again! No activity for 5 minutes")
    }
}

let idle;

// Ensures that DOM is fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', () => {
    idle = new Idleness();
    
    // Only start checking when dom is ready
    setInterval(() => {
        idle.handleCheckIdleTime();
    }, 10000);
});



async function throwLogout() {
    const data = await apiRequest({
            url: "/api/logout",
            method: "POST",
            body: { reason: "idle timeout" }
        });
}

// Good practice to standardized header if fetch() will be used across your project
async function apiRequest({ url, method = "GET", body = null }) {
    try {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        return await response.json(); // return parsed JSON
    } catch (error) {
        console.error("API request error:", error);
        throw error; // rethrow for the caller to handle
    }
}
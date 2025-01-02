class CustomAnimation {
    constructor(duration = 500) {
        this.duration = duration;
        this.startTime = null;
        this.startPositions = null;
        this.endPositions = null;
        this.callback = null;
    }

    start(startPositions, endPositions, callback) {
        this.startTime = millis();
        this.startPositions = startPositions;
        this.endPositions = endPositions;
        this.callback = callback;
    }

    update() {
        if (this.startTime === null) return;

        const elapsedTime = millis() - this.startTime;
        const progress = min(elapsedTime / this.duration, 1);

        const currentPositions = this.startPositions.map((startPos, index) => {
            const endPos = this.endPositions[index];
            return {
                x: startPos.x + (endPos.x - startPos.x) * progress,
                y: startPos.y + (endPos.y - startPos.y) * progress,
                align: endPos.align // Prendre en compte la propriété align
            };
        });

        push();
        if (this.callback) {
            this.callback(currentPositions);
        }
        pop();

        if (progress === 1) {
            this.startTime = null;
        }
    }

    isRunning() {
        return this.startTime !== null;
    }
}

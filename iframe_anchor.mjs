export default class extends HTMLElement {
    constructor(...args) {
        const self = super(...args);
        this.iframe = document.createElement("iframe");
        document.body.append(this.iframe);
        this.iframe.style.position = "fixed";
        this.update();
        this.moved();
        var observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) this.startAnimation();
            else this.stopAnimation();
        }, { threshold: [0] });
        observer.observe(this);
        return self;
    }

    startAnimation()
    {
        if (this.animation) throw new Error("Animation already running");
        console.log("Started animation");
        const callback = () => {
            if (this.update()) this.moved();
            this.animation = requestAnimationFrame(callback);
        };
        callback();
    }

    stopAnimation()
    {
        if (!this.animation) throw new Error("Animation already stopped");
        console.log("Stopped animation")
        cancelAnimationFrame(this.animation);
        this.animation = null;
    }

    update() {
        const displayed = this.isConnected && 
                          getComputedStyle(this).display != "none";
        if (!displayed) {
            const changed = this.displayed;
            this.displayed = false;
            return changed;
        }
        const rect = this.getBoundingClientRect();
        const changed = this.top != rect.top || this.left != rect.left ||
                        this.height != rect.height || this.width != rect.width ||
                        !this.displayed;
        if (changed) {
            this.displayed = true;
            this.top = rect.top;
            this.left = rect.left;
            this.height = rect.height;
            this.width = rect.width;
        }
        return changed;
    }

    moved() {
        if (!this.displayed) {
            this.iframe.style.display = "none";
            return;
        }
        this.iframe.style.display = null;
        this.iframe.style.top = this.top + "px";
        this.iframe.style.left = this.left + "px";
        this.iframe.style.width = this.width + "px";
        this.iframe.style.height = this.height + "px";
    }
}
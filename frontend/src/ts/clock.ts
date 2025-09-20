import { format } from "date-fns";
import type { Locale } from "date-fns/locale";
import { locales } from "./locales";

const CLOCK_UPDATE_INTERVAL = 1000;

interface ClockConfig {
    showDate: boolean;
    dateFormat: string;
    showTime: boolean;
    timeFormat: "12" | "24";
    langCode: string;
}

class Clock {
    private config: ClockConfig;
    private timeEl: HTMLElement;
    private dateEl?: HTMLElement;
    private intervalId?: number;
    private lang: Locale;

    constructor(config: ClockConfig) {
        this.config = config;

        // Initialize language
        this.lang = locales[this.config.langCode] || locales["enGB"];

        // Initialize elements
        const clockContainer = document.getElementById("clock") || document.body;

        // Ensure time element exists
        let timeEl = clockContainer.querySelector(".clock--time") as HTMLElement;
        if (!timeEl) {
            timeEl = document.createElement("span");
            timeEl.className = "clock--time";
            clockContainer.appendChild(timeEl);
        }
        this.timeEl = timeEl;

        // Optional date element
        this.dateEl = clockContainer.querySelector(".clock--date") as HTMLElement;
    }

    private updateTime() {
        const now = new Date();
        const formatStr =
            this.config.timeFormat === "12" ? "h:mm:ss a" : "HH:mm:ss";
        this.timeEl.innerText = format(now, formatStr, { locale: this.lang });
    }

    private updateDate() {
        if (!this.config.showDate || !this.dateEl) return;
        this.dateEl.innerText = format(new Date(), this.config.dateFormat, {
            locale: this.lang,
        });
    }

    private render = () => {
        this.updateTime();
        this.updateDate();
    };

    public start() {
        this.render();
        this.intervalId = window.setInterval(this.render, CLOCK_UPDATE_INTERVAL);
    }

    public stop() {
        if (this.intervalId) window.clearInterval(this.intervalId);
    }
}

export function initClock(
    showDate: boolean,
    dateFormat: string,
    showTime: boolean,
    timeFormat: "12" | "24",
    langCode: string,
) {
    const clock = new Clock({
        showDate,
        dateFormat,
        showTime,
        timeFormat,
        langCode,
    });
    clock.start();
    return clock;
}

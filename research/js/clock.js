class ClockImageComponent {
            constructor() {
                this.topImage = document.getElementById('topImage');
                this.bottomImage = document.getElementById('bottomImage');
                this.clockFace = document.getElementById('clockFace');
                this.timeDisplay = document.getElementById('timeDisplay');

                // 移除对已隐藏的刻度容器的引用
                // this.hourMarks = document.getElementById('hourMarks'); 
                // this.minuteMarks = document.getElementById('minuteMarks');

                this.clockCenter = document.getElementById('clockCenter');
                this.statusIndicator = document.getElementById('statusIndicator');
                this.hourHand = document.getElementById('hourHand');
                this.minuteHand = document.getElementById('minuteHand');
                this.secondHand = document.getElementById('secondHand');

                this.isPaused = false;
                this.startTime = Date.now();
                this.pausedTime = null;
                this.animationFrameId = null;

                this.initClock();
                this.setupEventListeners();
                this.startClock();
            }

            setupEventListeners() {
                this.clockCenter.addEventListener('click', (e) => {
                    // 阻止事件冒泡到 .clock-container
                    e.stopPropagation();
                    this.togglePause();
                });

                document.querySelector('.clock-container').addEventListener('click', (e) => {
                    // 仅在点击容器但不是中心点时切换暂停状态
                    // 这里的逻辑与上方的 stopPropagation 配合，保证点击非中心区域也可以暂停/恢复
                    this.togglePause();
                });
            }

            togglePause() {
                if (this.isPaused) {
                    this.resume();
                } else {
                    this.pause();
                }
            }

            pause() {
                this.isPaused = true;
                cancelAnimationFrame(this.animationFrameId);
                this.pausedTime = Date.now();

                this.clockCenter.classList.add('paused');
                this.statusIndicator.classList.add('paused');
            }

            resume() {
                this.isPaused = false;
                this.startTime = Date.now();
                this.pausedTime = null;

                this.clockCenter.classList.remove('paused');
                this.statusIndicator.classList.remove('paused');

                this.animate();
            }

            /* 关键修改 4: 移除刻度创建逻辑 */
            initClock() {
                // 刻度元素已被移除或隐藏，无需在此创建
            }

            getCurrentTime() {
                if (this.isPaused && this.pausedTime) {
                    return this.pausedTime;
                }
                return Date.now();
            }

            updateHands() {
                const now = new Date(this.getCurrentTime());
                const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
                const minutes = now.getMinutes() + seconds / 60;
                const hours = (now.getHours() % 12) + minutes / 60;

                // 计算角度
                const secondsAngle = seconds * 6;
                const minutesAngle = minutes * 6;
                const hoursAngle = hours * 30;

                // 更新指针旋转（平滑连续）
                this.secondHand.style.transform = `translate(-50%, -100%) rotate(${secondsAngle}deg)`;
                this.minuteHand.style.transform = `translate(-50%, -100%) rotate(${minutesAngle}deg)`;
                this.hourHand.style.transform = `translate(-50%, -100%) rotate(${hoursAngle}deg)`;

                // 根据秒针位置控制图像透明度（使用精确秒数）
                const secondsInt = Math.floor(seconds);
                const topOpacity = secondsInt <= 30 ? (1 - (secondsInt / 30)) : ((secondsInt - 30) / 30);
                const bottomOpacity = 1 - topOpacity;

                this.topImage.style.opacity = topOpacity;
                this.bottomImage.style.opacity = bottomOpacity;

                // 更新时间显示
                const timeString = now.toLocaleTimeString('zh-CN', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });

                this.timeDisplay.textContent = this.isPaused ? `${timeString} (暂停)` : timeString;
            }

            animate() {
                this.updateHands();
                this.animationFrameId = requestAnimationFrame(() => this.animate());
            }

            startClock() {
                this.animate();
            }
        }

        // 初始化组件
        document.addEventListener('DOMContentLoaded', () => {
            new ClockImageComponent();
        });
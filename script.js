const container = document.querySelector(".container"),
    mainVideo = container.querySelector("video"),
    VideoTimeLine = container.querySelector(".video-timeline"),
    progressBar = container.querySelector(".progress-bar"),
    skipBackward = container.querySelector(".skip-backward i"),
    skipForward = container.querySelector(".skip-forward i"),
    VolumeBtn = container.querySelector(".volume i"),
    currentVidTime = container.querySelector(".current-time"),
    currentDurationTime = container.querySelector(".video-duration"),
    VolumeSlider = container.querySelector(".left input"),
    speedBtn = container.querySelector(".playback-content span"),
    speedOptions = container.querySelector(".speed-options"),
    picInPicBtn = container.querySelector(".pic-in-pic span"),
    fullScreenBtn = container.querySelector(".full-screen i"),
    playPauseBtn = container.querySelector(".play-pause i");
    let timer;
    const hideControls = ()=>{
     if(!mainVideo.paused) return;
     timer = setTimeout(()=>{
     container.classList.remove("show-controls");
    } , 2500)
}
container.addEventListener("mousemove" ,() =>{
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();
});
hideControls();
// Format time to display in HH:MM:SS format
const formatTime = (time) => {
    let seconds = Math.floor(time % 60),
        minutes = Math.floor(time / 60) % 60,
        hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
};

// Update the progress bar and current time as the video plays
mainVideo.addEventListener("timeupdate", (e) => {
    const { currentTime, duration } = e.target;
    const percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
});

// Display total video duration when loaded
mainVideo.addEventListener("loadeddata", (e) => {
    currentDurationTime.innerText = formatTime(e.target.duration);
});

// Click on the timeline to seek the video
VideoTimeLine.addEventListener("click", (e) => {
    let timelineWidth = VideoTimeLine.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

const draggableProgressBar = (e)=>{
    let timelineWidth = VideoTimeLine.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}
container.addEventListener("mousedown" , ()=>{
    VideoTimeLine.addEventListener("mousemove" , draggableProgressBar)
});
container.addEventListener("mouseup" , ()=>{
    VideoTimeLine.removeEventListener("mousemove" , draggableProgressBar)
});
VideoTimeLine.addEventListener("mousemove" , e=>{
    progressTime = VideoTimeLine.querySelector("span");
    let offsetX = e.offsetX;
    progressTime.style.left = `${offsetX}px`;
    let timelineWidth = VideoTimeLine.clientWidth;
    let precent = (e.offsetX / timelineWidth) * mainVideo.duration;
    progressTime.innerText = formatTime(precent);
});
// Adjust the volume using the volume slider
VolumeSlider.addEventListener("input", (e) => {
    mainVideo.volume = e.target.value;

    if (mainVideo.volume === 0) {
        VolumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    } else {
        VolumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    }
});

// Toggle mute/unmute on volume button click
VolumeBtn.addEventListener("click", () => {
    if (mainVideo.volume === 0) {
        mainVideo.volume = 0.5;
        VolumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    } else {
        mainVideo.volume = 0.0;
        VolumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    VolumeSlider.value = mainVideo.volume;
});

// Toggle fullscreen mode
fullScreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen");
    if (document.fullscreenElement) {
        fullScreenBtn.classList.replace("fa-compress", "fa-expand");
        document.exitFullscreen();
    } else {
        container.requestFullscreen();
        fullScreenBtn.classList.replace("fa-expand", "fa-compress");
    }
});

// Enable picture-in-picture mode
picInPicBtn.addEventListener("click", () => {
    mainVideo.requestPictureInPicture();
});

// Skip backward by 5 seconds
skipBackward.addEventListener("click", () => {
    mainVideo.currentTime -= 5;
});

// Skip forward by 5 seconds
skipForward.addEventListener("click", () => {
    mainVideo.currentTime += 5;
});

// Toggle playback speed options
speedBtn.addEventListener("click", () => {
    speedOptions.classList.toggle("show");
});

// Set the playback speed when an option is clicked
speedOptions.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

// Hide speed options if clicked outside
document.addEventListener("click", (e) => {
    if (!speedOptions.contains(e.target) && !speedBtn.contains(e.target)) {
        speedOptions.classList.remove("show");
    }
});

// Toggle play/pause when button is clicked
playPauseBtn.addEventListener("click", () => { 
    mainVideo.paused ? mainVideo.play() : mainVideo.pause(); 
}); 
 
// Change play/pause icon when video is playing 
mainVideo.addEventListener("play", () => { 
    playPauseBtn.classList.replace("fa-play", "fa-pause"); 
}); 
 
// Change play/pause icon when video is paused 
mainVideo.addEventListener("pause", () => { 
    playPauseBtn.classList.replace("fa-pause", "fa-play"); 
});

(function () {
  var HERO = "#agentforce-command-hero";
  var LABEL_CLOSED = "Discover the latest from MuleSoft";
  var LABEL_OPEN = "Discover the latest from MuleSoft";
  var VIDEO_URL =
    "https://www.salesforce.com/plus/experience/dreamforce_2026/series/salesforce_platform_at_dreamforce_2026/episode/episode-s1e5";

  var ICON_EXPAND =
    '<span class="cl-changelog-button__right"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="cl-icon-expand"><path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></span>';
  var ICON_COLLAPSE =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.998 12.9994V18.4994H9.49805V14.4994H5.49805V12.9994H10.998ZM14.498 5.49939V9.49939H18.498V10.9994H12.998V5.49939H14.498Z" fill="white"/></svg>';

  var TEMPLATE =
    '<span class="cl-backdrop"></span>' +
    '<button class="cl-changelog-button" type="button" aria-expanded="false" aria-controls="changelogPanel" aria-label="Open Changelog">' +
    '<span class="cl-changelog-button__left">' +
    '<span class="cl-pulse" aria-hidden="true"><span class="cl-pulse-dot"></span><span class="cl-pulse-ring"></span><span class="cl-pulse-fill"></span></span>' +
    '<span class="cl-divider" aria-hidden="true"></span>' +
    '<span class="cl-label">' + LABEL_CLOSED + "</span>" +
    "</span>" +
    '<span class="cl-changelog-button__icon-wrap" aria-hidden="true">' + ICON_EXPAND + "</span>" +
    "</button>" +
    '<div id="changelogPanel" class="cl-changelog-panel">' +
    '<span class="cl-changelog-shadow"></span>' +
    '<div class="cl-changelog-bg"><div class="cl-changelog-frame"><div class="cl-changelog-body">' +
    '<div class="cl-grid">' +
    '<div class="cl-col-main">' +
    "<div>" +
    '<a class="cl-video" href="' + VIDEO_URL + '" target="_blank" rel="noopener">' +
    '<img src="https://wp.sfdcdigital.com/mulesoft/en-us/wp-content/uploads/sites/40/2026/10/changelog-pill-keynote.jpg" alt="Data 360 Keynote" loading="lazy">' +
    '<span class="cl-video__shade"></span>' +
    '<span class="cl-video__play"><span><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span></span>' +
    "</a>" +
    '<div><span class="cl-tag cl-tag--video">Video</span></div>' +
    '<p class="cl-featured" style="margin-top:8px">MuleSoft Keynote: From AI to ROI with Agent Fabric</p>' +
    "</div>" +
    '<div class="cl-cta"><a class="cl-button" href="' + VIDEO_URL + '" target="_blank" rel="noopener">Sign up to see it live or on Salesforce+</a></div>' +
    "</div>" +
    '<div class="cl-col-side">' +
    '<a class="cl-item" href="https://www.salesforce.com/news/stories/agent-fabric-catch-failures-control-ai-costs/" aria-label="Forrester" target="_blank" rel="noopener">' +
    '<div><span class="cl-tag cl-tag--sm cl-tag--report">New</span></div>' +
    '<p class="cl-item__title">Built-in safeguards to catch AI agent failures and eliminate runaway spend.</p>' +
    '<p class="cl-item__meta">October 27, 2026 • 3 min read</p>' +
    "</a>" +
    '<a class="cl-item" href="/lp/reports/forrester-wave-apim">' +
    '<div><span class="cl-tag cl-tag--sm cl-tag--webinar">Report</span></div>' +
    '<p class="cl-item__title">MuleSoft named a Leader by Forrester</p>' +
    '<p class="cl-item__meta">October 2, 2026 • 4 min read</p>' +
    "</a>" +
    '<a class="cl-item" href="/pricing">' +
    '<div><span class="cl-tag cl-tag--sm cl-tag--announcement">Pricing</span></div>' +
    '<p class="cl-item__title">New pricing: now starting at $2k per month</p>' +
    '<p class="cl-meta">September 14, 2026 • 3 min read</p>' +
    "</a>" +
    "</div>" +
    "</div>" +
    "</div></div></div>" +
    "</div>";

  function build(eyebrow) {
    var root = document.createElement("div");
    root.id = "cl-changelog";
    root.className = "cl-changelog";
    root.innerHTML = TEMPLATE;
    eyebrow.parentNode.insertBefore(root, eyebrow);
    eyebrow.classList.add("cl-eyebrow-hidden");

    for (var el = root.parentNode; el && el !== document.body; el = el.parentNode) {
      el.classList.add("cl-overflow-visible");
      if (el.matches(HERO)) break;
    }

    var button = root.querySelector(".cl-changelog-button");
    var label = root.querySelector(".cl-label");
    var iconWrap = root.querySelector(".cl-changelog-button__icon-wrap");
    var bg = root.querySelector(".cl-changelog-bg");
    var backdrop = root.querySelector(".cl-backdrop");

    var isOpen = false;
    var progress = 0;
    var frame = null;
    var metrics = { rightPx: 0, bottomPx: 0, radius: 28, maxX: 0 };

    function paint(t) {
      var clip =
        "inset(0px " + (1 - t) * metrics.rightPx + "px " + (1 - t) * metrics.bottomPx + "px 0px round " + metrics.radius + "px)";
      bg.style.clipPath = clip;
      bg.style.setProperty("-webkit-clip-path", clip);
      root.style.setProperty("--p", String(t));
      iconWrap.style.transform = "translate3d(" + t * metrics.maxX + "px, 0, 0)";
    }

    function measure() {
      var b = button.getBoundingClientRect();
      var p = bg.getBoundingClientRect();
      var i = iconWrap.getBoundingClientRect();
      var base = i.left - p.left - progress * metrics.maxX;
      var radius = Math.round(parseFloat(getComputedStyle(bg).borderTopLeftRadius || "28")) || 28;
      metrics = {
        rightPx: Math.max(Math.round(p.width - b.width), 0),
        bottomPx: Math.max(Math.round(p.height - b.height), 0),
        radius: radius,
        maxX: Math.max(Math.round(p.width - 16 - (base + i.width)), 0),
      };
      paint(progress);
    }

    function animate(target) {
      if (frame) cancelAnimationFrame(frame);
      var from = progress;
      var delta = target - from;
      if (delta === 0) {
        paint(target);
        return;
      }
      var duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 10 : 500;
      var easeOut = function (x) { return 1 - (1 - x) * (1 - x); };
      var easeIn = function (x) { return x * x; };
      var ease = target > from ? easeOut : easeIn;
      var start = performance.now();
      var step = function (now) {
        var y = Math.min(1, (now - start) / duration);
        progress = from + delta * ease(y);
        paint(progress);
        if (y < 1) {
          frame = requestAnimationFrame(step);
        } else {
          progress = target;
          paint(progress);
          frame = null;
        }
      };
      frame = requestAnimationFrame(step);
    }

    function setOpen(open) {
      isOpen = open;
      root.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Close Changelog" : "Open Changelog");
      label.textContent = open ? LABEL_OPEN : LABEL_CLOSED;
      iconWrap.innerHTML = open ? ICON_COLLAPSE : ICON_EXPAND;
    }

    function toggle() {
      measure();
      animate(isOpen ? 0 : 1);
      setOpen(!isOpen);
    }

    function close() {
      if (!isOpen) return;
      setOpen(false);
      animate(0);
    }

    button.addEventListener("click", toggle);
    backdrop.addEventListener("click", close);
    root.addEventListener("focusout", function (e) {
      if (isOpen && e.relatedTarget && !root.contains(e.relatedTarget)) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    measure();
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(measure);
      ro.observe(bg);
      ro.observe(button);
    }
    window.addEventListener("resize", measure);
  }

  function init() {
    var eyebrow = document.querySelector(HERO + " .eyebrow");
    if (!eyebrow) return false;
    if (!document.getElementById("cl-changelog")) build(eyebrow);
    return true;
  }

  function start() {
    if (init()) return;
    var observer = new MutationObserver(function () {
      if (init()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

// ==UserScript==
// @name Ghost with Original Images
// @description This UserScript is used to replace resized image source URL to original size.
// @author HoJeong Go <seia@outlook.kr>
// @namespace https://github.com/seia-soto
// @license MIT
// @copyright Copyright (C) 2022, by HoJeong Go <seia@outlook.kr>
// @match http://*/*
// @match https://*/*
// @version 1.0.0
// @run-at document-end
// ==/UserScript==

(function _main(_hot){
  const log = (..._args) => console.log('[ghost with original images]', ..._args)

  const isGhostWebsite = () => {
    log(`checking if ${window.location.host} is powered by ghost`)

    const meta = document.querySelector('meta[name="generator"]')

    if (!meta) {
      return !1
    }

    const attr = meta.getAttribute('content')

    if (!attr) {
      return !1
    }

    return attr.toLowerCase().includes('ghost')
  }

  const replaceImages = () => {
    const images = document.querySelectorAll(`img[srcset*="/images/size/"]`)

    log(`found ${images.length} images on this website!`)

    for (let i = 0, l = images.length; i < l; i++) {
      const image = images[i]
      const srcset = image.getAttribute('srcset')

      if (!srcset) {
        continue
      }

      const [resized] = srcset.split(',')

      if (!resized) {
        continue
      }

      const segments = resized.split('/')
      const position = segments.indexOf('size')

      if (position < 0) {
        continue
      }

      segments.splice(position, 2)

      const src = segments.join('/').split(' ').shift()

      if (!src) {
        continue
      }

      image.outerHTML = `<img src="${src}" />`

      log(`replaced to ${src}`)
    }
  }

  if (typeof window === 'undefined') {
    log('trying to mitigate sandbox environment')

    if (_hot) {
      log('the script is hot-loaded and trying to duplicate and eval instead')

      eval(`(${_main.toString()})()`)
    } else {
      log('exiting: failed to escape the sandbox!')
    }

    return
  }

  log('loaded the script!')

  if (!isGhostWebsite()) {
    log(`exiting: ${window.location.host} is not a ghost powered website!`)

    return
  }

  replaceImages()
})(!0)

import {nextTick, onMounted, onUnmounted} from 'vue'

export enum EventType {
    Scroll = 'scroll',
    Wheel = 'wheel',
    Message = 'message'
}

export function useEventListener<T extends Event>(
    target: Window | HTMLElement | EventTarget,
    event: EventType,
    callback: EventListener,
    options?: boolean | AddEventListenerOptions) {
    onMounted(() => target.addEventListener(event, callback, options))
    onUnmounted(() => target.removeEventListener(event, callback))
}

/**
 * 左侧菜单滚动吸附。
 * @param domId
 */
export function useScrollSticky(domId: string) {

    const handleMenuScroll = (event: Event) => {
        event.stopPropagation()
        const mainElement: HTMLElement | null = document.querySelector(domId)
        if (mainElement) {
            const styles = getComputedStyle(mainElement)
            let data = styles.getPropertyValue('--header-banner-height')
            let top = 0
            if (data) {
                top =  parseInt(data.replace('px', '')) - window.scrollY
                top = top > 0 ? top : 0
            }
            mainElement.style.setProperty('--sticky-pane-height', `calc(100vh - ${top}px)`)
        }
    }

    useEventListener(window, EventType.Scroll, handleMenuScroll)
}


/**
 * 鼠标左右滚动模块
 * @param id 滚动容器的ID
 * @param offset 每次滚动的偏移量（像素）
 */
export function useScrollHorizontalMenu(id: string, offset: number) {
    let container: HTMLElement | null = null

    const scrollMenu = (direction: string) => {
        if (container) {
            if (direction === 'right') {
                container.scrollLeft += offset
            } else {
                container.scrollLeft -= offset
            }
        }
    }
    function handleWheel(event: Event) {
        event.stopPropagation()
        if (event instanceof WheelEvent) {
            if (event.deltaY !== 0) {
                event.preventDefault()
                const scrollDirection = event.deltaY > 0 ? 'right' : 'left'
                scrollMenu(scrollDirection)
            }
        }
    }

    nextTick(() => {
        container = document.querySelector(id)
        container?.addEventListener(EventType.Wheel, handleWheel, { passive: false })
    })

    onUnmounted(() => {
        container?.removeEventListener(EventType.Wheel, handleWheel)
    })
}
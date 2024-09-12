import NProgress from 'nprogress'
NProgress.configure({
    speed: 300,
    showSpinner: false,
})

const excludePath = ['/', '/app/home/dashboard']

export default function () {
    const NProgressStart = (path: string) => {
        if (!excludePath.includes(path)) {
            NProgress.start()
        }
    }
    const NProgressDone = () => {
        if (NProgress.isStarted()) {
            NProgress.done()
        }
    }
    return {
        NProgressStart,
        NProgressDone,
    }
}

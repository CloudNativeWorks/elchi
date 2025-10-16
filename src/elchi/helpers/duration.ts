import { Version } from 'src/conf'

type DurationModuleType = {
    Duration: {
        // eslint-disable-next-line
        toJSON: (duration: any) => string
    }
}

const DURATION_MODULES: Record<Version, DurationModuleType['Duration']> = {}

async function initializeDurationModules() {
    await Promise.all(window.APP_CONFIG.AVAILABLE_VERSIONS.map(async (version) => {
        // Explicit dynamic imports for each version
        let module
        switch (version) {
            case 'v1.36.0':
                module = await import('../versions/v1.36.0/models/google/protobuf/duration')
                break
            case 'v1.35.3':
                module = await import('../versions/v1.35.3/models/google/protobuf/duration')
                break
            default:
                throw new Error(`Unsupported version: ${version}`)
        }
        DURATION_MODULES[version] = module.Duration
    }))
}

// Initialize modules and catch any errors
initializeDurationModules().catch(error => {
    console.error('Failed to initialize duration modules:', error)
})

export const getDurationValueAsNumber = (duration: any, version: Version): number | undefined => {
    if (duration) {
        let nmbr: number = 0
        const DurationModule = DURATION_MODULES[version]
        const str: string = DurationModule?.toJSON(duration) as string

        if (typeof str === 'string' && str.endsWith('s')) {
            nmbr = Number(str.replace("s", ""))
        }
        return nmbr
    }
    return undefined
}

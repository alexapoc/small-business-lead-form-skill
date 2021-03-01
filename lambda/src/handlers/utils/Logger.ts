export module Logger {

    export async function log(message: string) {
        console.log(message);
    }

    export async function error(error: string) {
        console.error(error);
    }

    export async function debug(message: string) {
        if (process.env.CONSOLE_DEBUG_LOG_ENABLED || false) {
            console.debug(message);
        }
    }
}
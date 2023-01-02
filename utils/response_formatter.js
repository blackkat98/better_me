const format = (successful, status, message = '', data = null, meta = null) => {
    if (successful) {
        let returnData = data
        let returnMeta = meta

        if (data && data.data && data.meta) {
            returnData = data.data

            if (typeof returnMeta === 'object' && returnMeta) {
                for (let key in data.meta) {
                    returnMeta[key] = data.meta[key]
                }
            } else {
                returnMeta = data.meta
            }
        }

        return {
            success: true,
            status: status,
            message: message,
            data: returnData,
            meta: returnMeta,
        }
    }

    return {
        success: false,
        status: status,
        message: message,
        data: null,
        meta: null,
    }
}

module.exports = format

const Serializer = require('./Serializer')

class PomodoroSerializer extends Serializer
{
    static single(pomodoro) {
        return {
            id: pomodoro.id,
            name: pomodoro.name,
            goal: pomodoro.goal,
            phases: pomodoro.phases,
            status: pomodoro.status,
            createdAt: pomodoro.createdAt,
            updatedAt: pomodoro.updatedAt,
        }
    }

    static pagination(obj) {
        let res = {
            data: [],
            meta: {},
        }
        obj.docs.forEach(element => {
            res.data.push(PomodoroSerializer.single(element))
        })
        res.meta = {
            total: obj.totalDocs || 0,
            perPage: obj.limit || 10,
            totalPages: obj.totalPages || 0,
            page: obj.page || 1,
            prevPage: obj.prevPage || null,
            nextPage: obj.nextPage || null,
            pagingCounter: obj.pagingCounter || 0,
        }

        return res
    }
}

module.exports = PomodoroSerializer

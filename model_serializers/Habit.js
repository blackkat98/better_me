const Serializer = require('./Serializer')

class HabitSerializer extends Serializer
{
    static single(habit) {
        return {
            id: habit.id,
            name: habit.name,
            description: habit.description || '',
            frequency: habit.frequency,
            goal: habit.goal,
            layout: habit.layout,
            createdAt: habit.createdAt,
            updatedAt: habit.updatedAt,
        }
    }

    static pagination(obj) {
        let res = {
            data: [],
            meta: {},
        }
        obj.docs.forEach(element => {
            res.data.push(HabitSerializer.single(element))
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

module.exports = HabitSerializer

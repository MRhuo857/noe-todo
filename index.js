const db = require('./db.js')
const inquirer = require('inquirer');
module.exports.add = async (title) => {
    const list = await db.read()
    list.push({title, done: false})
    await db.write(list)
}
module.exports.clear = async () => {
    await db.write([])
}
function done(list,index){
    list[index].done = true
    db.write(list)
}
function aksForCreateTask(list) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '输入任务标题',
    }).then(answer => {
        list.push({
            title: answer.title,
            done: false
        })
        db.write(list)
    })
}
function askForAction(list, index) {
    inquirer.prompt({
        type: 'list', name: 'action',
        message: '请选择',
        choices: [
            {name: '退出', value: 'quit'},
            {name: '已完成', value: 'done'},
            {name: '未完成', value: 'unDone'},
            {name: '改标题', value: 'updateTitle'},
            {name: '删除标题', value: 'remove'},
        ]
    }).then((answers2) => {
        switch (answers2.action) {
            case 'done':
               done(list,index)
                break;
            case 'unDone':
                list[index].done = false
                db.write(list)
                break;
            case 'updateTitle':
                inquirer.prompt({
                    type: 'input',
                    name: 'title',
                    message: '新的标题',
                }).then(answer => {
                    list[index].title = answer.title
                    db.write(list)
                })
                break;
            case 'remove':
                list.splice(index, 1)
                db.write(list)
                break;
        }
    })
}
function printTask(list) {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'index',
                message: '请选择操作',
                choices: [...list.map((task, index) => {
                    return {name: `${task.done ? '[√]' : '[x]'} ${index + 1} - ${task.title}`, value: index.toString()}
                }), {name: '退出', value: '-1'}, {name: '创建任务', value: '-2'}],
            },
        ])
        .then((answers) => {
            const index = parseInt(answers.index)
            if (index >= 0) {
                askForAction(list, index)
            } else if (index === -2) {
                aksForCreateTask(list, index)
            }
        });
}
module.exports.showAll = async () => {
    const list = await db.read()
    printTask(list)
}
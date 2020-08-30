import * as AWS  from 'aws-sdk'
const docClient = new AWS.DynamoDB.DocumentClient()
import { TodoItem  } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})
import { getUserId } from '../auth/utils'
import * as uuid from 'uuid'
import { createLogger } from '../utils/logger'
const logger = createLogger('todos')
import { persistTodo, removeTodo,getUploadUrl, updateUploadUrl, getTodo,updateTodoItem } from '../dataLayer/persistance'

export async function createTodo(todo:CreateTodoRequest, jwtToken: string) {

  const todoId = uuid.v4()
  let userId: string = getUserId(jwtToken)
  const newToDoItem: TodoItem = {
    todoId: todoId,
    userId: userId,
    createdAt: new Date().toISOString(),
    name: todo.name,
    dueDate: todo.dueDate,
    done: false // attachment url empty?
  }
  await persistTodo(newToDoItem)
  logger.info('New todo created', { newToDoItem })
  return newToDoItem

}

export async function deleteTodo(todoId: string) {
  
  await removeTodo(todoId)
  logger.info('Todo deleted', { todoId: todoId })
  
}

export async function produceUploadUrl(todoId: string) {

  const url: string = getUploadUrl(todoId)
  logger.info("Presigned URL fetched", { presignedUrl: url })
  await updateUploadUrl(todoId)
  return url

}

export async function getAllTodos(jwtToken:string) {
  
  let userId: string =  getUserId(jwtToken)
  const result = await getTodo(userId)
  logger.info("Fetched Todos", { userId: userId })
  return result

}

export async function updateTodo(todoId: string, todo: UpdateTodoRequest) {
  
  await updateTodoItem(todoId, todo)
  logger.info("Updated Todo", { todoId: todoId })
  return

}
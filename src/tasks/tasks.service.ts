import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.schema';
import { TaskStatus } from './task-status.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/user.schema';

@Injectable()
export class TasksService {
  private logger = new Logger('TaskService');

  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async getAllTasks(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async getTasksWithFilters(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query: any = { user: user['_id'] };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    try {
      // const tasks = await this.taskModel.find(query);
      const tasks = await this.taskModel.find(query).populate('user');
      return tasks;
    } catch (error) {
      this.logger.error(
        `Fail to get tasks for user "${user.username}", DTO: ${JSON.stringify(
          filterDto,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new this.taskModel({
      title,
      description,
      status: TaskStatus.OPEN,
      user: user['_id'],
    });

    try {
      const savedTask = await task.save();
      return savedTask.toObject();
    } catch (error) {
      this.logger.error(
        `Failed to create a task for user "${user.username}". Data: ${createTaskDto}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: id, user: user['_id'] });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found!`);
    }
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.taskModel
      .deleteOne({ _id: id, user: user['_id'] })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found!`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;

    await task.save();

    return task;
  }
}

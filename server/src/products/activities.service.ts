import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ActivitiesService {
  async findAll() {
    try {
      const dataPath = path.join(process.cwd(), 'data', 'activities.json');
      if (fs.existsSync(dataPath)) {
        const data = fs.readFileSync(dataPath, 'utf-8');
        const activities = JSON.parse(data);
        return {
          code: 200,
          msg: 'success',
          data: activities,
        };
      } else {
        return {
          code: 200,
          msg: 'success',
          data: [],
        };
      }
    } catch (error) {
      console.error('读取活动数据失败:', error);
      return {
        code: 500,
        msg: '读取活动数据失败',
        data: [],
      };
    }
  }
}

import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import dayjs from 'dayjs';
import { Exclude } from 'class-transformer';

export abstract class BaseRecord {
  @CreateDateColumn({
    type: 'timestamp',
    insert: true,
    transformer: {
      to: (val) => val,
      from: (val) => dayjs(val).format('YYYY-MM-DD HH:mm:ss'),
    },
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    update: true,
    transformer: {
      to: (val) => val,
      from: (val) => dayjs(val).format('YYYY-MM-DD HH:mm:ss'),
    },
  })
  updateTime: Date;

  @DeleteDateColumn()
  @Exclude()
  deleteTime: Date;

  // @BeforeUpdate()
  // updateDates() {
  //     this.updateTime = new Date();
  // }
}

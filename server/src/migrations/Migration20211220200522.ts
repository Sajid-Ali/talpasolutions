import { Migration } from '@mikro-orm/migrations';

export class Migration20211220200522 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "sensor_data_point" ("id" serial primary key, "value" int4 not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
  }

}

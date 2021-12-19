import { Migration } from "@mikro-orm/migrations";

export class Migration20211219170648 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "machine" ("id" serial primary key, "name" text not null, "last_known_position" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);'
    );

    this.addSql(
      'create table "sensor" ("id" serial primary key, "name" text not null, "created_at" timestamptz(0) not null, "machine_id" int4 not null);'
    );
    this.addSql(
      'alter table "sensor" add constraint "sensor_machine_id_unique" unique ("machine_id");'
    );

    this.addSql(
      'create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);'
    );

    this.addSql(
      'alter table "sensor" add constraint "sensor_machine_id_foreign" foreign key ("machine_id") references "machine" ("id") on update cascade;'
    );
  }
}

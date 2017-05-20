// import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';

export default function (db: mongoose.Connection) {

  const schema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: mongoose.Schema.Types.String,
  });

  return db.model('TestModel', schema);

};

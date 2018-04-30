import mongoose from 'mongoose';

const formSchema = mongoose.Schema({
  eventName: String,
  startDate: String,
  endDate: String,
  startHour: String,
  endHour: String,
  userData: [{
    userName: String,
    availableTime: Object,
    userUrl: { type: String, unique: true }
  }],
  eventTime: Object,
  eventUrl: { type: String, unique: true },
  adminUrl: { type: String, unique: true }
});

export const Form = mongoose.model('Form', formSchema);

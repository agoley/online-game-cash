var mongoose = require('mongoose');
var Schema  = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

var UserSchema = new Schema({
	_id: { type: ObjectIdSchema, default: function () { return new ObjectId() } },
	username: String,
	password: String,
    token: String,
	email: { type: String, unique: true },
	coin_available: { type: Number, default: 0 },
	coin_buffered: { type: Number, default: 0 },
	admin: Boolean,
	cart:  { type : Array , default : [] },
	credit_available: { type: Number, default: 0 },
	credit_buffered: { type: Number, default: 0 },
	billing_address: {},
	last_transaction: {},
	mailing_address: {
					lineOne: String,
					lineTwo: String,
					city: String,
					state: String,
					zip: Number
					},
	billing_info: { type : Array , default : [] }
});

module.exports = mongoose.model('User', UserSchema);
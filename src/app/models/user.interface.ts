import { MailingAddress } from './mailing-address.interface'

export interface User {
    _id: number,
	username: string,
	password: string,
    token: string,
	email: string,
	coin_available: number,
	coin_buffered: number,
	admin: boolean,
	cart:  any[],
	credit_available: number,
	credit_buffered: number,
	billing_address: any,
	last_transaction: any,
	mailing_address: MailingAddress,
	billing_info: any[]
}

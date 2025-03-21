export const CLIENTID = process.env.CLIENTID || "Ab0ReLbfKPCOJ1KhwRkm13JI-icCoYYo7yUGrFQpQ5wUUQBY2oLBaX3X4KDRLy6KGkwN-Nr2Vj2RNapQ";
export const SECRET_KEY= process.env.SECRET_KEY || "ECDLd2LHthO83E_PiCwgFXzOXgIDckYjU15n0KJe4K2ZAFnI0fc_ABL47kLuRBilWjaqE3Q_C47PGMjB";

export const HOST = `${process.env.WEB}/api/v1/` || "http://localhost:3100"
export const SUCCESS_URL = process.env.SUCCESS_URL || "http://localhost:3000/payment/success"

export const PAYPAL_HOST = process.env.PAYPAL_HOST || "https://api-m.sandbox.paypal.com"

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_51QDsbwGCEqKXLQNB8H2safwcgJteiPhS0IdEEMHJsjIFhabfg4p4P0TX7Qv08BwdLl9eWSDmBb97A0cMEQ5mvTLE003RdOzNAw"
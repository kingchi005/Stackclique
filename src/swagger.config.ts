export default {
	openapi: "3.0.0",
	servers: [
		{
			description: "SwaggerHub API Auto Mocking",
			url: "https://virtserver.swaggerhub.com/kingchi005/StackClique/1.0.0",
		},
		{
			description: "localhost",
			url: "http://localhost:500",
		},
	],
	info: {
		description: "This is the API documentation for Stack clique mobile app",
		version: "1.0.0",
		title: "Stack clique API",
		contact: {
			email: "kingchi.aeworks@gmail.com",
		},
	},
	tags: [
		{
			name: "authentication Route",
			description: "This route handle all authentication requests",
		},
	],
	paths: {
		"/auth/send-verification/{email}": {
			get: {
				tags: ["authentication Route"],
				summary: "request for email verification code",
				operationId: "verifyEmail",
				description:
					"By passing user's email, the user will get an email with the 4 digit code",
				parameters: [
					{
						in: "path",
						name: "email",
						description: "pass the user's email",
						required: true,
						schema: {
							type: "string",
						},
					},
				],
				responses: {
					"200": {
						description: "Success response",
						content: {
							"application/json": {
								examples: {
									"201": {
										value:
											'{\n  "ok": true,\n  "data": {},\n  "message": "Email was sent to \'example@gmail.com\'. Please check you email"\n}',
									},
								},
							},
						},
					},
					"401": {
						description: "Success response",
						content: {
							"application/json": {
								examples: {
									"201": {
										value:
											'{\n  "ok": false,\n  "error":{\n    "message": "string"\n  }\n}',
									},
								},
							},
						},
					},
					"500": {
						description: "sever error",
					},
				},
			},
		},
		"/auth/signup": {
			summary: "Sign up route",
			description: "Sign up route",
			post: {
				tags: ["authentication Route"],
				summary: "Send a sign up request",
				description: "",
				operationId: "signUp",
				requestBody: {
					$ref: "#/components/requestBodies/signupReqBody",
				},
				responses: {
					"201": {
						description: "Succes response",
						content: {
							"application/json": {
								examples: {
									SIgnUpSuccessResponse: {
										value:
											'{\n  "ok": true,\n  "message": "Registreation successful",\n  "data": {\n    "email": "king@fmnd.sa",\n    "username": "Jane David",\n    "id": 5\n  }\n}',
									},
								},
							},
						},
					},
				},
			},
		},
		"/auth/login": {
			post: {
				tags: ["authentication Route"],
				summary: "Login route",
				description: "Login route",
				operationId: "logIn",
				requestBody: {
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/loginReqSchema",
							},
							example: {
								username: "string",
								email: "string",
								otp: 1234,
								password: "string",
							},
						},
					},
				},
				responses: {
					"200": {
						description: "succesful login",
						content: {
							"application/json": {
								examples: {
									"201": {
										value:
											'{\n  "ok": true,\n  "message": "Login successful",\n  "data": {\n    "id": 4,\n    "username": "Jane David",\n    "email": "dohti@zi.vg",\n    "UserAccessToken": "string"\n  }\n}',
									},
								},
							},
						},
					},
					"400": {
						description: "Invalid response",
						content: {
							"application/json": {
								examples: {
									"400": {
										value:
											'{\n  "ok": false,\n  "error": {\n    "message": "Provide a valid email, \'password\' must be 6 ore more characters",\n    "details": {\n      "issues": [\n        {\n          "validation": "email",\n          "code": "invalid_string",\n          "message": "Provide a valid email",\n          "path": [\n            "email"\n          ]\n        },\n        {\n          "code": "too_small",\n          "minimum": 6,\n          "type": "string",\n          "inclusive": true,\n          "exact": false,\n          "message": "\'password\' must be 6 ore more characters",\n          "path": [\n            "password"\n          ]\n        }\n      ],\n      "name": "ZodError"\n    }\n  }\n}',
									},
								},
							},
						},
					},
					"401": {
						description: "Invalid response",
						content: {
							"application/json": {
								examples: {
									"400": {
										value:
											'{\n  "ok": false,\n  "error": {\n    "message": "Incorrect email or password"\n  }\n}',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	components: {
		schemas: {
			signUpReqSch: {
				properties: {
					username: {
						type: "string",
					},
					email: {
						type: "string",
					},
					otp: {
						type: "number",
					},
					password: {
						type: "string",
					},
				},
				type: "object",
			},
			loginReqSchema: {
				type: "object",
			},
			EmailVrificationSuccessResponse: {
				required: ["ok"],
				properties: {
					ok: {
						type: "boolean",
						example: true,
					},
					message: {
						type: "string",
						example:
							"Email was sent to 'example@stackclique.com'. Please check you email",
					},
					data: {
						type: "object",
					},
				},
				type: "object",
			},
			ErrorResponse: {
				required: ["ok"],
				properties: {
					ok: {
						type: "boolean",
						example: false,
					},
					error: {
						properties: {
							message: {
								type: "string",
							},
							details: {
								type: "object",
							},
						},
						type: "object",
					},
				},
				type: "object",
			},
		},
		requestBodies: {
			signupReqBody: {
				description: "A JSON object containing pet information",
				required: true,
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/signUpReqSch",
						},
					},
				},
			},
		},
	},
};

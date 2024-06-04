# Custom UI Extension Template

Celtra CA allows teams to build custom UI extensions to better connect with external tools and workflows. This project provides the documentation for setting up the extension, available API methods, as well as provide a template project you can use to get started with your own extension.

The extension template is in typescript.
It uses [Vue](https://vuejs.org/) ([Pinia](https://pinia.vuejs.org/)) framework with [Vuetify](https://vuetifyjs.com/en/) frontend components and a [Vite](https://vitejs.dev/) build.
The build packages all files into a single html which can then be served by either uploading it to your own sever or hosting it with Celtra.

As long as a single url can be provided, on which the extension is hosted, any technologies, languages, frameworks... can be used.

## Quick Start

### Before you begin
To work with this repository, you will need [node and npm installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

[Fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) this repository to change it and make it your own.

[Create a Celtra API App](https://support.celtra.io/account/users/set-up-an-api-application) to use basic auth.

> [!CAUTION]
> For development and testing, a Celtra sandbox account should be used to avoid partially developed extensions to be visible to all users. If you do not have access to a Celtra sandbox account please contact your Account Manager.

### Basic operations
1.  `npm ci` to install packages
2.  `npm run lint` to lint code and `npm run lint-fix` to fix lint problems
3.  `npm run build` to build a single `index.html` file in the `./dist` folder
4.  `npm run dev` to build code and start development server.

### Registering your extension on the platform

1. Run `npm run build` to create `dist/index.html`

2. You have two options to add extensions to the Celtra platform:

	- **Self-hosted `index.html`:**

		Host the `index.html` file on your own server or hosting service. The html must be served with `text/html` mime type and must not have headers preventing it from being served inside an `iframe`. You will need to pass the url where the `index.html` is hosted in the `indexHtmlUrl` parameter. Example for adding an extension with a self-hosted `index.html`:

			curl -X POST \
   				--location 'https://hub.celtra.io/api/uiExtensions' \
				--user '<ApiAppId>:<ApiAppKey>' \
				--header 'Content-Type: application/json;charset=UTF-8' \
				--data '{
					"accountId": "<your account id>",
					"name": "Example Extension",
					"isEnabled": true,
					"indexHtmlUrl": "<your hosting url>"
				}'

	- **Celtra-hosted `index.html`:**

		You can also use Celtra to host your extension's `index.html` file. Encode the `index.html` file using `base64` and pass it in the `html` parameter. Example for adding an extension with a Celtra-hosted `index.html`:

			# Base64 encode index.html.
			html_content=$(cat /path/to/file | base64 -w 0)
			# Or in some Mac shells
			# html_content=$(cat /path/to/file | base64 -b 0)

			# Construct JSON payload with Base64-encoded HTML.
			json_payload='{
				"accountId": "<your account id>",
				"name": "Example Extension",
				"isEnabled": true,
				"html": "'"$html_content"'"
			}'

			# Send POST request with JSON payload using curl.
			curl -X POST \
				--location 'https://hub.celtra.io/api/uiExtensions' \
				--user '<ApiAppId>:<ApiAppKey>' \
				-H 'Content-Type: application/json;charset=UTF-8' \
				-d @- <<EOF
					$json_payload
				EOF


To view the extension in Celtra CA, open a Design File and go to Overview tab, click on Export button and you should see your extension as an option in Distribute list.

> [!NOTE]
> If your extension contains errors or URL is not accessible, it might not appear in the list.

### Development environment

During development you can also use localhost URL you get when running `npm run dev` as `indexHtmlUrl`.

## Celtra `uiExtensions` API endpoint

#### Add extension to account

You can add new extensions to an account using the `POST` method.

Self-hosed `index.html`:

	curl -X POST \
 		--location 'https://hub.celtra.io/api/uiExtensions' \
		--user '<ApiAppId>:<ApiAppKey>' \
		--header 'Content-Type: application/json;charset=UTF-8' \
		--data '{
			"accountId": "<your account id>",
			"name": "Example Extension",
			"isEnabled": true,
			"indexHtmlUrl": "<your hosting url>"
		}'

Celtra-hosed `index.html`:

	# Base64 encode index.html.
	html_content=$(cat /path/to/file | base64 -w 0)

	# Construct JSON payload with Base64-encoded HTML.
	json_payload='{
		"accountId": "<your account id>",
		"name": "Example Extension",
		"isEnabled": true,
		"html": "'"$html_content"'"
	}'
	
	curl -X POST \
		--location 'https://hub.celtra.io/api/uiExtensions' \
		--user '<ApiAppId>:<ApiAppKey>' \
		-H 'Content-Type: application/json;charset=UTF-8' \
		-d @- <<EOF
			$json_payload
		EOF

#### List all extensions in account

You can list all extensions in an account using the `GET` method:

	curl -X GET \
 		--location 'https://hub.celtra.io/api/uiExtensions?accountId={accountId}' \
		--user '<ApiAppId>:<ApiAppKey>'

#### Edit existing extension

You can edit `name`, `isEnabled`, `indexHtmlUrl` and `html` properties of existing extensions using the `PUT` method.

> [!NOTE]
> The `indexHtmlUrl` and `html` cannot be set at the same time.

Self-hosed `index.html`:

	curl -X PUT \
	 	--location 'https://hub.celtra.io/api/uiExtensions/:extensionEntityId' \
		--user '<ApiAppId>:<ApiAppKey>' \
		--header 'Content-Type: application/json;charset=UTF-8' \
		--data '{
			"name": "New Example Extension",
			"isEnabled": false,
			"indexHtmlUrl": "<your hosting url>"
		}'

Celtra-hosed `index.html`:

	# Base64 encode index.html.
	html_content=$(cat /path/to/file | base64 -w 0)

	# Construct JSON payload with Base64-encoded HTML.
	json_payload='{
		"accountId": "<your account id>",
		"name": "Example Extension",
		"isEnabled": true,
		"html": "'"$html_content"'"
	}'
	
	curl -X PUT \
		--location 'https://hub.celtra.io/api/uiExtensions' \
		--user '<ApiAppId>:<ApiAppKey>' \
		-H 'Content-Type: application/json;charset=UTF-8' \
		-d @- <<EOF
			$json_payload
		EOF

#### Delete extension

You can delete a registered extension using the `DELETE` method:

	curl -X DELETE
 		--location 'https://hub.celtra.io/api/uiExtensions/:extensionEntityId' \
		--user '<ApiAppId>:<ApiAppKey>' \
		--header 'Content-Type: application/json;charset=UTF-8'


## Celtra extensions SDK

Celtra provides a public npm package `@celtra-public/eagle-extensions-sdk` published to GitHub packages. It provides predefined functions and data types (e.g. Export API output types and Custom Format Schema Definition) the extension can use to communicate with the Celtra CA platform.


### Functions

#### export
	export(request: Request): Promise<Response>
Request export as specified in `request` object. The request and response are the same as specified by the [export API](https://support.celtra.io/ca/export-api/exporting-outputs)

#### setOnBeforeUnloadMessage
	setOnBeforeUnloadMessage(message: string | null): Promise<void>
If set to `string`, the extension window will require additional confirmation before closing.

#### registerFormat
	registerFormat(formatRegistrationId: string, formatRegistrationOptions: FormatRegistrationOptions): Promise<void>
Register a new custom format using a schema. See `FormatRegistrationOptions` type for details on the schema structure.

#### registerDistributionWorkflow
	registerDistributionWorkflow(distributionWorkflowRegistrationId: string, distributionWorkflowRegistrationOptions: DistributionWorkflowRegistrationOptions): Promise<void>
Register a distribution workflow. This allows the extension to be visible in export dialog and open inside an iframe. `DistributionWorkflowRegistrationOptions` can contain formats registered in other extensions in `supportedFormats`.

#### registerOutputAttributes
	registerOutputAttributes(outputAttributesRegistrationOptions: OutputAttributesRegistrationOptions): Promise<void>
Register output attributes with possible values on platform. Output attributes can be used to filter outputs.

#### setOutputAttributes
	setOutputAttributes(outputAttributes: OutputAttributes[]): Promise<void>
Set output attribute values on platform for specified outputs.

#### setExtensionStorage
	setExtensionStorage(data: unknown): Promise<void>
Use Celtra to store data for this extension remotely. For example, output attributes can be saved into extension storage - see `src/stores/attributes/store` for example.

#### getExtensionStorage<T>
	getExtensionStorage<T>(): Promise<T>
Fetch the data stored by `setExtensionStorage`.

#### getOutputContentHashes
	getOutputContentHashes(): Promise<OutputContentHashes[]>
Get a list of output id's with a hash representing the content of the output.

#### on
	on(type: EventType, callback: VoidFunction): void
Register a `callback` function that is called when event of `type` occurs. See  `EventType` for possible options. Multiple callbacks can be registered.
This function can be utilised to sync extension state with other simultaneous users through storage.

#### off
	off(type: EventType, callback?: VoidFunction): void
Removes the `callback` for event of `type`. `callback` must be the same (`===` comparison is used). If `callback` is not specified, all callbacks removed.

### Properties

#### launchOptions

	readonly launchOptions: LaunchOptions
Launch options contain the setting the extension is ran in and information extensions in that setting usually use. The extensions are first ran in headless mode when the design file is opened and the extension receives `launchOptions.main`. When used in the export dialog (see `registerDistributionWorkflow`), the extension receives `launchOptions.distribution` .



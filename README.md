# Custom UI Extension Template

An example template for developing a custom UI extension for Celtra CA platform.

The template is in typescript.
It uses [Vue](https://vuejs.org/) ([Pinia](https://pinia.vuejs.org/)) framework with [Vuetify](https://vuetifyjs.com/en/) frontend components and a [Vite](https://vitejs.dev/) build.
The build packages all files into a single html which can then be served simply by uploading it and providing its url as source.

As long as a single url can be provided, on which the extension is available, any technologies, languages, frameworks... can be used.

## Usage instructions

### Before you begin
To work with this repository, you will need [node and npm installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

[Fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) this repository to change it and make it your own.

For development and testing Celtra sandbox account should be used to avoid partially developed extensions to be visible to all users. If you do not have access to Celtra sandbox account please contact your Account manager.

### Basic operations
1.  `npm ci` to install packages
2.  `npm run lint` to lint code and `npm run lint-fix` to fix lint problems
3.  `npm run build` to build a single `index.html` file in the `./dist` folder
4.  `npm run dev` to build code and start development server.

### Registering extension on the platform

1. [Create a Celtra API App](https://support.celtra.io/account/users/set-up-an-api-application) to use basic auth.

2. Run `npm run build` to create `dist/index.html`

3. Host the `index.html` file. As it's a simple html, you can do this in multiple ways - from creating own server to uploading it anywhere that allows file hosting and download. The html must be served with `text/html` mime type and must not have headers preventing it from being served inside an `iframe`. You will need the url where the html is served for next step.

4. Add extension on account:

		curl -X POST --location 'https://hub.celtra.io/api/uiExtensions' \
		--user '<ApiAppId>:<ApiAppKey>' \
		--header 'Content-Type: application/json;charset=UTF-8' \
		--data '{
			"accountId": "<your account id>",
			"name": "Example Extension",
			"isEnabled": true,
			"indexHtmlUrl": "<your hosting url>"
		}'
	To see the extension in Celtra platform, open Design file in Scaling Studio and go to Overview tab, click on Export button and you should see it as an option in Distribute list.

	Note: if your extension contains errors or URL is not accessible it might not appear in the list.


### Celtra uiExtensions API endpoint

You can request a list of extensions with the following get request:

	curl --location 'https://hub.celtra.io/api/uiExtensions?accountId={accountId}' \
	--user '<ApiAppId>:<ApiAppKey>'

After an extension is registered you can edit `name`, `isEnabled` and `indexHtmlUrl` properties with a PUT request:

	curl -X PUT --location 'https://hub.celtra.io/api/uiExtensions/:extensionEntityId' \
	--user '<ApiAppId>:<ApiAppKey>' \
	--header 'Content-Type: application/json;charset=UTF-8' \
	--data '{
		"name": "New Example Extension",
		"isEnabled": false,
		"indexHtmlUrl": "<your hosting url>"
	}'

You can delete a registered extension with a DELETE request:

	curl -X DELETE --location 'https://hub.celtra.io/api/uiExtensions/:extensionEntityId' \
	--user '<ApiAppId>:<ApiAppKey>' \
	--header 'Content-Type: application/json;charset=UTF-8'


### Development environment

During development you can also use localhost URL you get when running `npm run dev` as `indexHtmlUrl`. See [Registering extension on the platform](#registering-extension-on-the-platform).


## Celtra platform <> extensions SDK

Celtra provides a public npm package `@celtra-public/eagle-extensions-sdk` published to GitHub packages that provides the ability to communicate with the Celtra platform using predefined functions and types for Celtra's data e.g. Export API output types and Custom format schema definition.

**The SDK provides the following methods:**

	readonly launchOptions: LaunchOptions
> Launch options contain the setting the extension is ran in and information extensions in that setting usually use. The extensions are first ran in headless mode when the design file is opened and the extension receives `launchOptions.main`. When used in the export dialog (see `registerDistributionWorkflow`), the extension receives `launchOptions.distribution` .

---
	export(request: Request): Promise<Response>
> Request export as specified in `request` object. The request and response are the same as specified by the [export API](https://support.celtra.io/ca/export-api/exporting-outputs)

---
	setOnBeforeUnloadMessage(message: string | null): Promise<void>
> If set to `string`, the extension window will require additional confirmation before closing.

---
	registerFormat(formatRegistrationId: string, formatRegistrationOptions: FormatRegistrationOptions): Promise<void>
> Register a new custom format using a schema. See `FormatRegistrationOptions` type for details on the schema structure.

---
	registerDistributionWorkflow(distributionWorkflowRegistrationId: string, distributionWorkflowRegistrationOptions: DistributionWorkflowRegistrationOptions): Promise<void>
> Register a distribution workflow. This allows the extension to be visible in export dialog and open inside an iframe. `DistributionWorkflowRegistrationOptions` can contain formats registered in other extensions in `supportedFormats`.


---
	registerOutputAttributes(outputAttributesRegistrationOptions: OutputAttributesRegistrationOptions): Promise<void>
> Register output attributes with possible values on platform. Output attributes can be used to filter outputs.


---
	setOutputAttributes(outputAttributes: OutputAttributes[]): Promise<void>
> Set output attribute values on platform for specified outputs.


---
	setExtensionStorage(data: unknown): Promise<void>
> Use Celtra to store data for this extension remotely. For example, output attributes can be saved into extension storage - see `src/stores/attributes/store` for example.


---
	getExtensionStorage<T>(): Promise<T>
> Fetch the data stored by `setExtensionStorage`.


---
	getOutputContentHashes(): Promise<OutputContentHashes[]>
> Get a list of output id's with a hash representing the content of the output.


---
	on(type: EventType, callback: VoidFunction): void
> Register a `callback` function that is called when event of `type` occurs. See  `EventType` for possible options. Multiple callbacks can be registered.
This function can be utilised to sync extension state with other simultaneous users through storage.

---
	off(type: EventType, callback?: VoidFunction): void
> Removes the `callback` for event of `type`. `callback` must be the same (`===` comparison is used). If `callback` is not specified, all callbacks removed.

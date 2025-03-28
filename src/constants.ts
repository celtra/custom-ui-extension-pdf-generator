import { DistributionWorkflowRegistrationOptions, OutputAttributesRegistrationOptions } from '@celtra/eagle-extensions-sdk'

const icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFJSURBVHgBpVPRTcNADLWdDMAIsEG7QUcoE9AOgMp9IjjqEBCfacQAaScANggTtBvQEfqL1NzhixKoiFMhYel0ztN7786xD6En0vR55sBxyAloYe1lovGoRzx26K587Ia+ckPJJ5xmoz8byMkD8LDia7NlNtuQI5BqEGugB1ciUsFP2RI+BUC4IO+MasCcnVIUFR78SL43cu1zObmUK69wT2uIasPEWvOqcQljenFQvc/tDIX4RvuoCM5sDcuWh8W3ZhEwjUtiP2jItahx10PhEgKW8tfnAWz2TZ9e45Krqqm0aZykuffoR6GuPoOj3AD+FgjGYSn4N5fgn3FosGvr6wtp40nD2XUM6pEFd5Y85B/8mA06YsGkjeum9mGLxz/uMrIAE77PJmF4tPDeTefWlIdYZ5T5ziw1Md8Ytb3qW2gDEaXW6hgFvgDt07/urBbAcQAAAABJRU5ErkJggg=='

export const EXAMPLE_DISTRIBUTION_WORKFLOW: DistributionWorkflowRegistrationOptions = {
    label: 'PDF Generator',
    iconUrl: icon, // Icon can be encoded data or an externally available URL
    initialWindowSize: { width: 1200, height: 640 },
    supportedFormats: null, // null to support all formats
    // A specific subset of formats can be specified in an array. Formats registered by other extensions can be used:
    // supportedFormats: ['com.celtra.image', 'com.celtra.video', 'com.celtra.html'],
    supportedContentScaling: 'manual',
}

export const OUTPUT_ATTRIBUTES_REGISTRATION_OPTIONS: OutputAttributesRegistrationOptions = {
    'Channel': {
        filterable: true,
        filterValues: ['Paid Media', 'eCommerce'],
    },
    'Platform': {
        filterable: true,
        filterValues: ['DV360', 'Amazon'],
    },
}

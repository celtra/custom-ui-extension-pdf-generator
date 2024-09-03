import { defineStore } from 'pinia'
import type { State } from './types'
import celtra, { type OutputAttributes, type OutputAttributesRegistrationOptions } from '@celtra/eagle-extensions-sdk'

export const useAttributesStore = defineStore('AttributesStore', {
    state: (): State => ({
        outputAttributesRegistrationOptions: {},
        outputAttributes: [],
    }),
    actions: {
        async addRegisteredAttributes (outputRegistrationOptions: OutputAttributesRegistrationOptions) {
            this.outputAttributesRegistrationOptions = {
                ...this.outputAttributesRegistrationOptions,
                ...outputRegistrationOptions
            }
            await this.updateAttributes()
        },
        async removeRegisteredAttribute (name: string) {
            if (this.outputAttributesRegistrationOptions[name] !== undefined) {
                delete this.outputAttributesRegistrationOptions[name]
            }
            await this.updateAttributes()
        },
        async setAttribute (outputId: string, name: string, value: string | null) {
            const existingSingleOutputAttributes = this.outputAttributes.find((singleOutputAttributes) => singleOutputAttributes.outputId === outputId)
            if (existingSingleOutputAttributes === undefined) {
                if (value !== null) {
                    this.outputAttributes.push({
                        outputId,
                        attributes: {
                            [name]: value
                        }
                    })
                }
            } else if (value !== null) {
                existingSingleOutputAttributes.attributes[name] = value
            } else if (existingSingleOutputAttributes.attributes[name] !== undefined) {
                delete existingSingleOutputAttributes.attributes[name]
            }
            await this.updateAttributes()
        },
        async updateAttributes () {
            this.outputAttributes = getAttributesWithRemovedMismatches(this.outputAttributes, this.outputAttributesRegistrationOptions)

            await celtra.registerOutputAttributes(this.outputAttributesRegistrationOptions)
            await celtra.setOutputAttributes(this.outputAttributes)
            await celtra.setExtensionStorage({
                outputAttributesRegistrationOptions: this.outputAttributesRegistrationOptions,
                outputAttributes: this.outputAttributes,
            })
        },
        async getExtensionStorage () {
            try {
                const { outputAttributesRegistrationOptions, outputAttributes } = await celtra.getExtensionStorage<{ outputAttributesRegistrationOptions: OutputAttributesRegistrationOptions, outputAttributes: OutputAttributes[] }>()
                this.outputAttributesRegistrationOptions = outputAttributesRegistrationOptions
                this.outputAttributes = outputAttributes
            } catch (_) {
                // Ignore errors for extension storage not found.
            }
        },
    },
})

function getAttributesWithRemovedMismatches(outputAttributes: OutputAttributes[], registeredAttributes: OutputAttributesRegistrationOptions): OutputAttributes[] {
    return outputAttributes.map((singleOutputAttributes) => {
        return {
            outputId: singleOutputAttributes.outputId,
            attributes: Object.fromEntries(Object.entries(singleOutputAttributes.attributes).filter(([key, value]) => {
                const registeredAttribute = registeredAttributes[key]
                return registeredAttribute !== undefined && !(registeredAttribute.filterable && !registeredAttribute.filterValues.includes(value))
            }))
        }
    })
}

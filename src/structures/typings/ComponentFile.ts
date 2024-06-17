import {
    AnySelectMenuInteraction,
    AutocompleteInteraction,
    ButtonInteraction, ComponentType,
    ModalSubmitInteraction,
} from "discord.js";
import {DBMClient} from "../DBMClient";

type AnyInteraction =
    AutocompleteInteraction |
    ButtonInteraction |
    AnySelectMenuInteraction |
    ModalSubmitInteraction

export interface ComponentFile<I extends AnyInteraction | any = any, T extends object = {}> {
    customId: string,
    type: ComponentType,
    execute: (client: DBMClient, interaction: I extends AnyInteraction ? I : any, embeds: T) => unknown,
    embeds_path: string
}
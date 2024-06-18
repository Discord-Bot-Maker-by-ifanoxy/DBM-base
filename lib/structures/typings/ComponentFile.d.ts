import { AnySelectMenuInteraction, AutocompleteInteraction, ButtonInteraction, ComponentType, ModalSubmitInteraction } from "discord.js";
import { DBMClient } from "../DBMClient";
import { Embed } from "discord.js/typings";
type AnyInteraction = AutocompleteInteraction | ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction;
export interface ComponentFile<I extends AnyInteraction | any = any> {
    customId: string;
    type: ComponentType;
    execute: (client: DBMClient, interaction: I extends AnyInteraction ? I : any) => unknown;
    embeds: {
        [k: string]: Embed;
    };
}
export {};

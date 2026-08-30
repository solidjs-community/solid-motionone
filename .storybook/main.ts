import type {StorybookConfig} from "storybook-solidjs-vite"

export default {
	stories: ["../stories/**/*.stories.@(ts|tsx)"],
	framework: "storybook-solidjs-vite",
} satisfies StorybookConfig

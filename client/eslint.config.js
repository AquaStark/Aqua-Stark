import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsx11y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "jsx-a11y": jsx11y
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            // A11y Rules
            "jsx-a11y/alt-text": "error",
            "jsx-a11y/anchor-has-content": "error",
            "jsx-a11y/anchor-is-valid": "error",
            "jsx-a11y/aria-props": "error",
            "jsx-a11y/aria-role": "error",
            "jsx-a11y/aria-unsupported-elements": "error",
            "jsx-a11y/click-events-have-key-events": "error",
            "jsx-a11y/heading-has-content": "error",
            "jsx-a11y/html-has-lang": "error",
            "jsx-a11y/img-redundant-alt": "error",
            "jsx-a11y/label-has-associated-control": "error",
            "jsx-a11y/mouse-events-have-key-events": "error",
            "jsx-a11y/no-access-key": "error",
            "jsx-a11y/no-autofocus": "error",
            "jsx-a11y/no-noninteractive-element-interactions": "error",
            "jsx-a11y/no-static-element-interactions": "error",
            "jsx-a11y/role-has-required-aria-props": "error",
            "jsx-a11y/tabindex-no-positive": "error",
        },
    }
);

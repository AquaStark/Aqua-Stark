# Components

This document provides an overview of the reusable React components available in the `src/components` directory. Each component is designed to be modular, reusable, and consistent with the application's design language.

## Contribution Guide

We welcome contributions to our component library! To ensure consistency and quality, please follow these guidelines:

1.  **Create a New Branch:** Always create a new feature branch for your component work.
2.  **Component Structure:** Each component should be in its own file (e.g., `MyComponent.tsx`). Complex components can be organized into a subdirectory.
3.  **Styling:** Use Tailwind CSS for styling whenever possible. For dynamic or complex styles, you may use inline styles or a CSS-in-JS approach.
4.  **Props:** Define clear and concise `props` using TypeScript interfaces.
5.  **Testing:** Add unit tests for your component using a testing framework like Vitest or React Testing Library.
6.  **Documentation:** Update this `README.md` file with documentation for your new or modified component.
7.  **Pull Request:** Open a pull request with a clear description of your changes.

## Component Documentation

Below is a list of available components with their purpose, usage examples, props, and styling information.

---

### `BubblesBackground`

-   **Purpose:** Renders an animated background of bubbles, creating a dynamic and visually appealing underwater effect.
-   **Usage Example:**

    ```tsx
    import { BubblesBackground } from '@/components/bubble-background';
    import { useBubbles } from '@/hooks/use-bubbles';

    function AquariumScene() {
      const bubbles = useBubbles(30); // Generate 30 bubbles
      return (
        <div className="relative w-full h-screen">
          <BubblesBackground bubbles={bubbles} />
          {/* Other content */}
        </div>
      );
    }
    ```

-   **Props:**

| Prop              | Type                  | Default         | Description                                        |
| ----------------- | --------------------- | --------------- | -------------------------------------------------- |
| `bubbles`         | `Bubble[]`            | -               | An array of bubble objects to be rendered.         |
| `className`       | `string`              | `''`            | Optional additional CSS classes for the container. |
| `animationName`   | `string`              | `'float-up'`    | The name of the CSS animation to use.              |
| `customStyles`    | `React.CSSProperties` | `{}`            | Optional custom inline styles for the container.   |

-   **Styling:** The component uses a combination of inline styles for positioning and a `<style>` tag for the keyframe animation.

---

### `FishTank`

-   **Purpose:** A container component that displays its children within a fish tank image, creating a framed and thematic presentation.
-   **Usage Example:**

    ```tsx
    import { FishTank } from '@/components/fish-tank';

    function FishDisplay() {
      return (
        <FishTank>
          <img src="/fish/fish1.png" alt="A colorful fish" />
        </FishTank>
      );
    }
    ```

-   **Props:**

| Prop        | Type              | Default | Description                                           |
| ----------- | ----------------- | ------- | ----------------------------------------------------- |
| `children`  | `React.ReactNode` | -       | The content to be displayed inside the fish tank.     |
| `className` | `string`          | `''`    | Optional additional CSS classes for the container.    |
| `shadow`    | `boolean`         | `true`  | Toggles a subtle shadow effect inside the tank.       |

-   **Styling:** This component is styled using Tailwind CSS classes.

---

### `WalletConnection`

-   **Purpose:** Provides a user interface for connecting and disconnecting a Starknet wallet. It displays the user's wallet address when connected.
-   **Usage Example:**

    ```tsx
    import { WalletConnection } from '@/components/WalletConnection';

    function AppHeader() {
      return (
        <header className="flex justify-end p-4">
          <WalletConnection />
        </header>
      );
    }
    ```

-   **Props:** This component does not accept any props.

-   **Styling:** Styled with standard CSS classes such as `wallet-connected` and `wallet-selection`.

---

## Verification

To ensure that components function correctly after making changes, follow these steps:

1.  **Run the development server:**
    ```bash
    npm run dev
    ```
2.  **Navigate to the page** where the component is used and visually inspect its appearance and behavior.
3.  **Run the test suite** to ensure all existing tests pass:
    ```bash
    npm run test
    ```

## Documentation Validation

To validate the documentation, please ensure that:

1.  Every component in the `src/components` directory has an entry in this `README.md` file.
2.  Each entry includes a clear purpose, a usage example, a description of its props, and styling information.
3.  The information is up-to-date with the latest changes in the component's code.

### `FishStatus`

-   **Purpose:** Displays a set of progress bars to indicate a fish's hunger, energy, and happiness levels.
-   **Usage Example:**

    ```tsx
    import { FishStatus } from '@/components/FishStatus';

    function FishCard({ fish }) {
      const indicators = { hunger: fish.hunger, energy: fish.energy, happiness: fish.happiness };
      return (
        <div>
          <h3>{fish.name}</h3>
          <FishStatus indicators={indicators} />
        </div>
      );
    }
    ```

-   **Props:**

| Prop          | Type                                                | Default  | Description                                                                 |
| ------------- | --------------------------------------------------- | -------- | --------------------------------------------------------------------------- |
| `indicators`  | `Pick<FishIndicatorState, 'hunger' | 'energy' | 'happiness'>` | -        | An object with the fish's hunger, energy, and happiness values (0-100).     |
| `className`   | `string`                                            | `''`     | Optional additional CSS classes for the container.                          |
| `showLabels`  | `boolean`                                           | `true`   | Toggles the visibility of the labels and percentage values for each bar.    |
| `size`        | `'sm' | 'md'`                                       | `'md'`   | Sets the size of the progress bars and labels.                              |

-   **Styling:** The component is styled using Tailwind CSS and the `cn` utility for conditional classes. The bar color changes based on its value (green for high, amber for medium, red for low).

---

### `GameStatusBar`

-   **Purpose:** A visually rich status bar that can be used to represent game-related values like player health, experience points, or resource levels.
-   **Usage Example:**

    ```tsx
    import { GameStatusBar } from '@/components/game-status-bar';

    function PlayerHUD() {
      return (
        <GameStatusBar
          icon="❤️"
          value={80}
          color="from-red-500 to-red-600"
          label="Health"
        />
      );
    }
    ```

-   **Props:**

| Prop             | Type                  | Default | Description                                                                 |
| ---------------- | --------------------- | ------- | --------------------------------------------------------------------------- |
| `icon`           | `string | React.ReactNode` | -       | The icon to display next to the status bar.                                 |
| `value`          | `number`              | -       | The current value of the status bar.                                        |
| `maxValue`       | `number`              | `100`   | The maximum value of the status bar.                                        |
| `color`          | `string`              | -       | The Tailwind CSS color class for the bar (e.g., 'from-blue-500 to-blue-600'). |
| `label`          | `string`              | `''`    | An optional label displayed above the bar.                                  |
| `showPercentage` | `boolean`             | `true`  | Toggles the visibility of the percentage text in the center of the bar.     |
| `animated`       | `boolean`             | `true`  | Toggles the animation of the value when it changes.                         |

-   **Styling:** This component uses Tailwind CSS for styling and includes several animations for value changes and background effects.

---

### `GeneticCombinationsPage`

-   **Purpose:** A page component that displays information about genetic combinations for breeding fish, including guides on trait inheritance.
-   **Usage Example:**

    ```tsx
    import GeneticCombinationsPage from '@/components/genetics';

    function GeneticsTab() {
      return <GeneticCombinationsPage />;
    }
    ```

-   **Props:** This component does not accept any props.

-   **Styling:** The component is styled using Tailwind CSS and uses sub-components from `components/genetics/` for different sections.

---

## Related Documentation

-   [React Documentation](https://react.dev/)
-   [Tailwind CSS](https://tailwindcss.com/docs)
-   [Starknet React](https://starknet-react.com/)

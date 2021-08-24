import { Component, ReactNode } from "react";

type Props = { children: ReactNode };

type State = {
  hasError: boolean;
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div>
          Something went wrong while running the orderbook. Please report it to
          the developer 🙂
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

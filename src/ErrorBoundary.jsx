import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'monospace', background: '#fff', color: '#c00', minHeight: '100vh' }}>
          <h2 style={{ color: '#c00' }}>Runtime Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, color: '#666', marginTop: 16 }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

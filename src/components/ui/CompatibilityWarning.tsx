import { DeviceCapabilities } from "../../types";

export function CompatibilityWarning({ capabilities }: { capabilities: DeviceCapabilities }) {
    if (capabilities.supportsWebGL) return null;
  
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#e6b3ff',
        color: 'white',
        padding: '16px',
        textAlign: 'center',
        zIndex: 9999,
        fontFamily: 'Arial, sans-serif'
      }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Attention: Limited compatibility</h3>
        <p style={{ margin: 0 }}>
            Your browser does not support WebGL. Some functions may not work correctly. 
            We recommend updating your browser or using Chrome/Firefox.
        </p>
      </div>
    );
  }
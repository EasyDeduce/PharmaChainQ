import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./App.css";
import vaderBreath from './assets/vader-breath.mp3';

// Fixed mock data to match your table structure
const mockBatches = [
  {
    id: "BATCH001",
    name: "Bacta Gel",
    origin: "Kamino Medical Facility",
    composition: "Synthetic Bacta Compound",
    expiry: "1735689600", // 2025-01-01
    recipient: "Coruscant Hospital",
    tampered: false
  },
  {
    id: "BATCH002",
    name: "Kolto Serum",
    origin: "Manaan Labs",
    composition: "Pure Kolto Extract",
    expiry: "1767225600", // 2026-01-01
    recipient: "Tatooine Clinic",
    tampered: true
  }
];

function App() {
  const [batch, setBatch] = useState({
    id: "",
    name: "",
    origin: "",
    composition: "",
    expiry: "",
  });
  const [transferId, setTransferId] = useState("");
  const [transferRecipient, setTransferRecipient] = useState("");
  const [flagId, setFlagId] = useState("");
  const [batches, setBatches] = useState(mockBatches);
  const [section, setSection] = useState("home");
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [notification, setNotification] = useState("");
  const [isVaderMode, setIsVaderMode] = useState(false);
  
  const audioRef = useRef(null);
  const createFormRef = useRef(null);
  const transferFormRef = useRef(null);
  const flagFormRef = useRef(null);
  const particlesRef = useRef([]);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(vaderBreath);
    audioRef.current.volume = 0.3;
    audioRef.current.preload = 'auto';
  }, []);

  // Helper function to format dates properly
  const formatDate = (timestamp) => {
    try {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Optimized mouse tracking with faster throttling
  const handleMouseMove = useCallback((e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    let throttleTimer = null;
    const throttledMouseMove = (e) => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        handleMouseMove(e);
        throttleTimer = null;
      }, 8);
    };

    window.addEventListener('mousemove', throttledMouseMove);
    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [handleMouseMove]);

  // Enhanced particle system with better performance
  useEffect(() => {
    const createParticles = () => {
      const particles = [];
      for (let i = 0; i < 30; i++) {
        particles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.1,
          life: Math.random() * 100 + 50,
          maxLife: Math.random() * 100 + 50,
        });
      }
      particlesRef.current = particles;
    };

    const animateParticles = () => {
      const particles = particlesRef.current;
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

        if (particle.life <= 0) {
          particle.x = Math.random() * window.innerWidth;
          particle.y = Math.random() * window.innerHeight;
          particle.life = particle.maxLife;
        }

        particle.opacity = Math.max(0.1, Math.min(0.5, particle.life / particle.maxLife * 0.5));
      });
    };

    createParticles();
    const interval = setInterval(animateParticles, 100);
    return () => clearInterval(interval);
  }, []);

  // Enhanced flame effects
  useEffect(() => {
    const addFlameEffect = (formRef) => {
      if (!formRef.current) return;
      const container = formRef.current;
      const flameImg = container.querySelector('.flame');

      const handleMouseEnter = () => {
        if (flameImg) {
          flameImg.style.opacity = '1';
          flameImg.style.visibility = 'visible';
          flameImg.style.transform = 'translateX(-50%) scale(1.2) rotate(10deg)';
          
          setTimeout(() => {
            if (flameImg) {
              flameImg.style.opacity = '0';
              flameImg.style.transform = 'translateX(-50%) scale(1) rotate(0deg)';
              setTimeout(() => {
                if (flameImg) flameImg.style.visibility = 'hidden';
              }, 500);
            }
          }, 1200);
        }
      };

      container.addEventListener('mouseenter', handleMouseEnter);
      return () => container.removeEventListener('mouseenter', handleMouseEnter);
    };

    const cleanupCreate = addFlameEffect(createFormRef);
    const cleanupTransfer = addFlameEffect(transferFormRef);
    const cleanupFlag = addFlameEffect(flagFormRef);

    return () => {
      cleanupCreate && cleanupCreate();
      cleanupTransfer && cleanupTransfer();
      cleanupFlag && cleanupFlag();
    };
  }, [section]);

  // Enhanced Vader breath with screen shake and audio
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === 's' && section === 'home' && !isVaderMode) {
        setIsVaderMode(true);
        
        // Play Vader breath audio
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(err => console.log('Audio play failed:', err));
        }

        // Enhanced screen shake with multiple phases
        document.body.style.transform = 'translateX(0px)';
        document.body.classList.add('vader-mode');
        
        let shakeIntensity = 0;
        const shakeInterval = setInterval(() => {
          shakeIntensity += 0.8;
          const xShake = Math.sin(shakeIntensity) * (6 + Math.sin(shakeIntensity * 0.3) * 3);
          const yShake = Math.cos(shakeIntensity * 1.2) * (3 + Math.sin(shakeIntensity * 0.5) * 2);
          const rotation = Math.sin(shakeIntensity * 0.7) * 0.5;
          
          document.body.style.transform = `translateX(${xShake}px) translateY(${yShake}px) rotate(${rotation}deg)`;
          
          if (shakeIntensity > 40) {
            clearInterval(shakeInterval);
            document.body.style.transform = 'translateX(0px) translateY(0px) rotate(0deg)';
            document.body.classList.remove('vader-mode');
            
            setTimeout(() => {
              setIsVaderMode(false);
            }, 1000);
          }
        }, 50);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [section, isVaderMode]);

  // Show notification with enhanced styling
  const showNotification = (message, type = 'success') => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3500);
  };

  // Optimized form handlers with better validation
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setBatch(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!batch.id.trim() || !batch.name.trim() || !batch.origin.trim() || !batch.composition.trim()) {
      showNotification('Please fill in all required fields!', 'error');
      return;
    }

    // Check for duplicate batch ID
    if (batches.some(b => b.id === batch.id)) {
      showNotification('Batch ID already exists!', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const currentTime = Math.floor(Date.now() / 1000);
      const expiryTime = batch.expiry ? parseInt(batch.expiry) : currentTime + (365 * 24 * 60 * 60);
      
      const newBatch = {
        ...batch,
        expiry: expiryTime.toString(),
        recipient: "N/A",
        tampered: false
      };
      
      setBatches(prev => [...prev, newBatch]);
      showNotification('Batch created successfully! The Empire grows stronger.', 'success');
      
      setBatch({
        id: "",
        name: "",
        origin: "",
        composition: "",
        expiry: "",
      });
    } catch (error) {
      console.error(error);
      showNotification("Error creating batch. The Force is not with you.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferId.trim() || !transferRecipient.trim()) {
      showNotification('Please fill in all fields!', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const batchExists = batches.find(b => b.id === transferId);
      if (!batchExists) {
        showNotification('Batch not found! Search your feelings.', 'error');
        return;
      }
      
      setBatches(prev => prev.map(b => 
        b.id === transferId ? { ...b, recipient: transferRecipient } : b
      ));
      
      showNotification('Batch transferred successfully! The delivery is complete.', 'success');
      setTransferId("");
      setTransferRecipient("");
    } catch (error) {
      console.error(error);
      showNotification("Error transferring batch. The dark side clouds everything.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlag = async (e) => {
    e.preventDefault();
    if (!flagId.trim()) {
      showNotification('Please enter a Batch ID!', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const batchExists = batches.find(b => b.id === flagId);
      if (!batchExists) {
        showNotification('Batch not found! Your search is weak.', 'error');
        return;
      }
      
      if (batchExists.tampered) {
        showNotification('Batch is already flagged as tampered!', 'error');
        return;
      }
      
      setBatches(prev => prev.map(b => 
        b.id === flagId ? { ...b, tampered: true } : b
      ));
      
      showNotification('Batch flagged as tampered! The corruption is revealed.', 'success');
      setFlagId("");
    } catch (error) {
      console.error(error);
      showNotification("Error flagging batch. Betrayal has consequences.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`App ${isVaderMode ? 'vader-active' : ''}`}>
      {/* Dynamic particle background */}
      <div className="particles-container">
        {particlesRef.current.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
            }}
          />
        ))}
      </div>

      {/* Enhanced background with multiple layers */}
      <div className="background-layers">
        <div className="background-overlay" />
        <div className="background-gradient" />
      </div>

      {/* Interactive light following mouse */}
      <div 
        className="mouse-light"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-text">Processing...</div>
            <div className="loading-subtitle">The Force is working...</div>
          </div>
        </div>
      )}

      {/* Enhanced notification */}
      {notification && (
        <div className={`notification ${notification.includes('Error') || notification.includes('not found') || notification.includes('already') ? 'notification-error' : 'notification-success'}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.includes('Error') || notification.includes('not found') || notification.includes('already') ? '⚠️' : '✅'}
            </span>
            {notification}
          </div>
        </div>
      )}

      {/* Enhanced navigation with glassmorphism */}
      <nav className="menu">
        <div className="menu-container">
          {["home", "create", "transfer", "flag", "list"].map((item) => (
            <button 
              key={item}
              onClick={() => setSection(item)}
              className={`menu-button ${section === item ? 'active' : ''}`}
              disabled={isLoading}
            >
              <span className="button-text">
                {item === "home" ? "🏠 Home" :
                 item === "create" ? "➕ Create Batch" :
                 item === "transfer" ? "🔄 Transfer" :
                 item === "flag" ? "⚠️ Flag Tamper" : "📋 All Batches"}
              </span>
              <div className="button-glow"></div>
            </button>
          ))}
        </div>
      </nav>

      {/* Main content with smooth transitions */}
      <main className="main-content">
        <div className={`section-container ${section}`}>
          
          {section === "home" && (
            <div className="home-section">
              <div className="hero-content">
                <h1 className="hero-title">
                  <span className="title-line">Welcome to</span>
                  <span className="title-line main-title">PharmaChainQ</span>
                  <span className="title-line subtitle">Sith Edition</span>
                </h1>
                <p className="hero-subtitle">
                  Where pharmaceutical tracking meets the power of the dark side
                </p>
                <div className="hero-hint">
                  <span className="hint-text">Press 'S' to embrace your destiny...</span>
                  <div className="hint-glow"></div>
                </div>
                <div className="stats-display">
                  <div className="stat-item">
                    <span className="stat-number">{batches.length}</span>
                    <span className="stat-label">Total Batches</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{batches.filter(b => b.tampered).length}</span>
                    <span className="stat-label">Tampered</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{batches.filter(b => !b.tampered).length}</span>
                    <span className="stat-label">Secure</span>
                  </div>
                </div>
              </div>
              <div className="floating-elements">
                <div className="floating-orb orb-1"></div>
                <div className="floating-orb orb-2"></div>
                <div className="floating-orb orb-3"></div>
              </div>
            </div>
          )}

          {section === "create" && (
            <div className="form-section">
              <h2 className="section-title">Create New Batch</h2>
              <form ref={createFormRef} onSubmit={handleSubmit} className="enhanced-form">
                <div className="form-background"></div>
                <div className="flame">🔥</div>
                <div className="input-group">
                  <input
                    placeholder="Batch ID *"
                    name="id"
                    value={batch.id}
                    onChange={handleChange}
                    className="enhanced-input"
                    required
                    maxLength={20}
                  />
                  <div className="input-glow"></div>
                </div>
                <div className="input-group">
                  <input
                    placeholder="Drug Name *"
                    name="name"
                    value={batch.name}
                    onChange={handleChange}
                    className="enhanced-input"
                    required
                    maxLength={50}
                  />
                  <div className="input-glow"></div>
                </div>
                <div className="input-group">
                  <input
                    placeholder="Origin Location *"
                    name="origin"
                    value={batch.origin}
                    onChange={handleChange}
                    className="enhanced-input"
                    required
                    maxLength={100}
                  />
                  <div className="input-glow"></div>
                </div>
                <div className="input-group">
                  <input
                    placeholder="Composition *"
                    name="composition"
                    value={batch.composition}
                    onChange={handleChange}
                    className="enhanced-input"
                    required
                    maxLength={100}
                  />
                  <div className="input-glow"></div>
                </div>
                <div className="input-group">
                  <input
                    placeholder="Expiry (Unix timestamp - optional)"
                    name="expiry"
                    value={batch.expiry}
                    onChange={handleChange}
                    className="enhanced-input"
                    type="number"
                    title="Enter Unix timestamp (seconds since 1970). Leave empty for 1 year from now."
                  />
                  <div className="input-glow"></div>
                </div>
                <button type="submit" className="enhanced-button" disabled={isLoading}>
                  <span className="button-text">
                    {isLoading ? 'Creating...' : 'Create Batch'}
                  </span>
                  <div className="button-ripple"></div>
                </button>
              </form>
            </div>
          )}

          {section === "transfer" && (
            <div className="form-section">
              <h2 className="section-title">Transfer Batch</h2>
              <form ref={transferFormRef} onSubmit={handleTransfer} className="enhanced-form">
                <div className="form-background"></div>
                <div className="flame">🔥</div>
                <div className="input-group">
                  <input
                    placeholder="Batch ID *"
                    value={transferId}
                    onChange={(e) => setTransferId(e.target.value)}
                    className="enhanced-input"
                    required
                    list="batch-ids"
                  />
                  <datalist id="batch-ids">
                    {batches.map(batch => (
                      <option key={batch.id} value={batch.id} />
                    ))}
                  </datalist>
                  <div className="input-glow"></div>
                </div>
                <div className="input-group">
                  <input
                    placeholder="Recipient Address *"
                    value={transferRecipient}
                    onChange={(e) => setTransferRecipient(e.target.value)}
                    className="enhanced-input"
                    required
                    maxLength={100}
                  />
                  <div className="input-glow"></div>
                </div>
                <button type="submit" className="enhanced-button" disabled={isLoading}>
                  <span className="button-text">
                    {isLoading ? 'Transferring...' : 'Transfer'}
                  </span>
                  <div className="button-ripple"></div>
                </button>
              </form>
            </div>
          )}

          {section === "flag" && (
            <div className="form-section">
              <h2 className="section-title">Flag Tamper</h2>
              <form ref={flagFormRef} onSubmit={handleFlag} className="enhanced-form">
                <div className="form-background"></div>
                <div className="flame">🔥</div>
                <div className="input-group">
                  <input
                    placeholder="Batch ID *"
                    value={flagId}
                    onChange={(e) => setFlagId(e.target.value)}
                    className="enhanced-input"
                    required
                    list="batch-ids-flag"
                  />
                  <datalist id="batch-ids-flag">
                    {batches.filter(b => !b.tampered).map(batch => (
                      <option key={batch.id} value={batch.id} />
                    ))}
                  </datalist>
                  <div className="input-glow"></div>
                </div>
                <button type="submit" className="enhanced-button danger" disabled={isLoading}>
                  <span className="button-text">
                    {isLoading ? 'Flagging...' : 'Flag Tamper'}
                  </span>
                  <div className="button-ripple"></div>
                </button>
              </form>
            </div>
          )}

          {section === "list" && (
            <div className="table-section">
              <h2 className="section-title">All Batches</h2>
              {batches.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <p>No batches found in the system</p>
                  <p className="empty-subtitle">The galaxy awaits your first creation...</p>
                </div>
              ) : (
                <div className="table-container">
                  <div className="table-header">
                    <span className="batch-count">{batches.length} batches tracked</span>
                  </div>
                  <table className="enhanced-table">
                    <thead>
                      <tr>
                        <th>Batch ID</th>
                        <th>Drug Name</th>
                        <th>Origin Location</th>
                        <th>Composition</th>
                        <th>Expiry Date</th>
                        <th>Current Recipient</th>
                        <th>Security Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batches.map((b, index) => (
                        <tr key={b.id} className="table-row">
                          <td className="batch-id">{b.id}</td>
                          <td>{b.name}</td>
                          <td>{b.origin}</td>
                          <td>{b.composition}</td>
                          <td>{formatDate(b.expiry)}</td>
                          <td>{b.recipient || "N/A"}</td>
                          <td>
                            <span className={`status-badge ${b.tampered ? 'tampered' : 'secure'}`}>
                              {b.tampered ? "⚠️ Tampered" : "✅ Secure"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
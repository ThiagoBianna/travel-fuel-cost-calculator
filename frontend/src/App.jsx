import { useState, useEffect } from "react";

// Carregar Google Maps API dinamicamente
const loadGoogleMaps = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Google Maps API key não encontrada! Configure VITE_GOOGLE_MAPS_API_KEY no .env');
    return;
  }
  
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

const COMBUSTIVEIS = [
  { id: "GASOLINA", label: "Gasolina", emoji: "⛽", consumo: 12 },
  { id: "GASOLINA_ADITIVADA", label: "Gasolina Aditivada", emoji: "✨", consumo: 12.5 },
  { id: "ETANOL", label: "Etanol", emoji: "🌿", consumo: 8.5 },
  { id: "DIESEL", label: "Diesel", emoji: "🚛", consumo: 14 },
  { id: "GNV", label: "GNV", emoji: "💨", consumo: 11 },
];

export default function App() {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [combustivel, setCombustivel] = useState("GASOLINA");
  const [consumo, setConsumo] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);
  const [campoFocado, setCampoFocado] = useState(null);

  // Carregar Google Maps API quando o componente montar
  useEffect(() => {
    loadGoogleMaps();
  }, []);

  const combAtivo = COMBUSTIVEIS.find(c => c.id === combustivel);

  const buscarEnderecos = (valor) => {
    if (valor.length > 3 && window.google) {
      const service = new window.google.maps.places.AutocompleteService();

      service.getPlacePredictions({
        input: valor,
        componentRestrictions: { country: 'br' },
        types: ['address']
      }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          const formatados = predictions.map(p => ({
            label: p.description,
            ruaPrincipal: p.structured_formatting.main_text,
            subtitulo: p.structured_formatting.secondary_text
          }));
          setSugestoes(formatados);
        }
      });
    } else {
      setSugestoes([]);
    }
  };

  const usarGPS = () => {
    if (!navigator.geolocation) return alert("GPS não suportado");
    setLoading(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setOrigem(coords);
      setCampoFocado(null);
      setLoading(false);
    }, () => {
      alert("Erro ao obter sua localização. Verifique as permissões.");
      setLoading(false);
    });
  };

  const calcular = async () => {
    if (!origem || !destino) return alert("Preencha os campos!");
    setLoading(true);

    try {
      const service = new window.google.maps.DistanceMatrixService();

      service.getDistanceMatrix({
        origins: [origem],
        destinations: [destino],
        travelMode: 'DRIVING',
      }, async (response, status) => {
        if (status === 'OK' && response.rows[0].elements[0].status === "OK") {
          const distanciaMetros = response.rows[0].elements[0].distance.value;
          const distanciaKm = distanciaMetros / 1000;

          try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';
            const res = await fetch(`${API_URL}/api/calculo`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                origem: typeof origem === 'string' ? origem : "Minha Localização",
                destino,
                combustivel,
                consumo: parseFloat(consumo) || combAtivo.consumo,
                distancia: distanciaKm
              })
            });
            const dados = await res.json();
            setResultado(dados);
          } catch (e) {
            alert("Erro ao conectar com o backend Java.");
          } finally {
            setLoading(false);
          }
        } else {
          alert("Não foi possível calcular a distância. Verifique os endereços.");
          setLoading(false);
        }
      });
    } catch (e) {
      alert("Erro ao acessar o Google Maps.");
      setLoading(false);
    }
  };

  return (
      <div style={{
        minHeight: "100vh", position: "relative",
        background: "radial-gradient(ellipse at 20% 20%, #0d1033 0%, #05060f 60%)",
        fontFamily: "'DM Sans', sans-serif", color: "#e8eaf6", overflowX: "hidden"
      }}>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Space+Mono:wght@700&display=swap');
        @keyframes twinkle { from { opacity: 0.15; } to { opacity: 0.7; } }
      `}</style>

        <StarField />

        <div style={{ maxWidth: 460, margin: "0 auto", padding: "40px 20px", position: "relative", zIndex: 1 }}>

          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>⛽</div>
            <h1 style={{
              fontFamily: "'Space Mono', monospace", fontSize: 26,
              background: "linear-gradient(135deg, #f97316, #fbbf24)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>Vai dar quanto?</h1>
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", padding: 24, borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>

            {/* CAMPO ORIGEM */}
            <div style={{ marginBottom: 16, position: "relative" }}>
              <label style={labelStyle}>📍 Origem</label>
              <input
                  style={inputStyle}
                  value={typeof origem === 'string' ? origem : "Minha Localização"}
                  onFocus={() => setCampoFocado('origem')}
                  onChange={e => { setOrigem(e.target.value); buscarEnderecos(e.target.value); }}
                  placeholder="De onde você sai?"
              />
              {campoFocado === 'origem' && (
                  <div onClick={usarGPS} style={{ padding: "10px", background: "rgba(249,115,22,0.1)", color: "#f97316", borderRadius: 8, cursor: "pointer", fontSize: 13, marginTop: -8, marginBottom: 12 }}>
                    🎯 Usar localização atual
                  </div>
              )}
              {sugestoes.length > 0 && campoFocado === 'origem' && (
                  <div style={autocompleteBox}>
                    {sugestoes.map((s, i) => (
                        <div key={i} onClick={() => { setOrigem(s.label); setSugestoes([]); setCampoFocado(null); }} style={itemStyle}>
                          <div style={{ fontWeight: 'bold' }}>{s.ruaPrincipal}</div>
                          <div style={{ fontSize: '11px', color: '#9399b8' }}>{s.subtitulo}</div>
                        </div>
                    ))}
                  </div>
              )}
            </div>

            {/* CAMPO DESTINO */}
            <div style={{ marginBottom: 16, position: "relative" }}>
              <label style={labelStyle}>🏁 Destino</label>
              <input
                  style={inputStyle}
                  value={destino}
                  onFocus={() => setCampoFocado('destino')}
                  onChange={e => { setDestino(e.target.value); buscarEnderecos(e.target.value); }}
                  placeholder="Para onde vamos?"
              />
              {sugestoes.length > 0 && campoFocado === 'destino' && (
                  <div style={autocompleteBox}>
                    {sugestoes.map((s, i) => (
                        <div key={i} onClick={() => { setDestino(s.label); setSugestoes([]); setCampoFocado(null); }} style={itemStyle}>
                          <div style={{ fontWeight: 'bold' }}>{s.ruaPrincipal}</div>
                          <div style={{ fontSize: '11px', color: '#9399b8' }}>{s.subtitulo}</div>
                        </div>
                    ))}
                  </div>
              )}
            </div>

            {/* CAMPO CONSUMO - ALTERAÇÕES SOLICITADAS AQUI */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>
                🔧 Consumo do carro ({combustivel === "GNV" ? "km/m³" : "km/L"})
              </label>
              <input
                  style={inputStyle}
                  type="number"
                  value={consumo}
                  onChange={e => setConsumo(e.target.value)}
                  placeholder={combustivel === "GNV" ? `Média: ${combAtivo.consumo} km/m³` : `Média: ${combAtivo.consumo} km/L`}
              />
            </div>

            {/* COMBUSTÍVEL */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>⛽ Combustível</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {COMBUSTIVEIS.map(c => (
                    <button key={c.id} onClick={() => setCombustivel(c.id)} style={{
                      padding: "8px 12px", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 600,
                      background: combustivel === c.id ? "#f97316" : "rgba(255,255,255,0.06)",
                      color: "white", border: "none"
                    }}>{c.emoji} {c.label}</button>
                ))}
              </div>
            </div>

            <button onClick={calcular} disabled={loading} style={{
              width: "100%", padding: 16, background: "linear-gradient(135deg, #f97316, #ea580c)",
              border: "none", borderRadius: 14, color: "white", fontWeight: 700, cursor: "pointer",
              boxShadow: "0 8px 24px rgba(249,115,22,0.35)"
            }}>
              {loading ? "Calculando..." : "⚡ Calcular custo da viagem"}
            </button>

            {resultado && (
                <div style={{ marginTop: 24, padding: 20, background: "rgba(249,115,22,0.15)", borderRadius: 16, textAlign: "center", border: "1px solid rgba(249,115,22,0.3)" }}>
                  <span style={{ fontSize: 12, color: "#9399b8", marginBottom: 4, display: "block" }}>Distância: {resultado.distancia.toFixed(1)} km</span>
                  <span style={{ fontSize: 13, color: "#f97316", fontWeight: "bold" }}>Total Estimado:</span>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#f97316" }}>R$ {resultado.custo.toFixed(2)}</div>

                  {resultado.horarioPico && (
                      <div style={{
                        marginTop: 12, padding: "8px", background: "rgba(251,191,36,0.1)",
                        borderRadius: 8, border: "1px dashed rgba(251,191,36,0.3)",
                        fontSize: 12, color: "#fbbf24"
                      }}>
                        ⚠️ O consumo pode subir em horários de pico!
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 700, color: "#9399b8", textTransform: "uppercase", marginBottom: 6, display: "block" };
const inputStyle = { width: "100%", padding: "14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.11)", borderRadius: 12, color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 };
const autocompleteBox = { background: "#1a1c2e", borderRadius: 8, border: "1px solid #3f445e", overflow: "hidden", position: "absolute", width: "100%", zIndex: 10, top: '100%', marginTop: '-8px' };
const itemStyle = { padding: "10px 12px", borderBottom: "1px solid #2a2d3e", cursor: "pointer", fontSize: "13px", color: "white" };

const StarField = () => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, borderRadius: "50%",
            background: "white", opacity: Math.random() * 0.5 + 0.2,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
          }} />
      ))}
    </div>
);
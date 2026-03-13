import { VarganiSlip } from "@/types/admin";

const SlipPreviewContent = ({ slip }: { slip: VarganiSlip }) => (
    <div style={{
        width: '800px',
        background: '#FFFFFF',
        fontFamily: "'Noto Sans Devanagari', 'Mangal', 'Segoe UI', Arial, sans-serif",
        overflow: 'visible',
        border: '5px solid #1a237e',
        position: 'relative',
        boxSizing: 'border-box' as const
    }}>
        <div style={{ position: 'absolute', inset: '5px', border: '2px solid #5c6bc0', pointerEvents: 'none' as const, zIndex: 10 }} />

        {/* HEADER */}
        <div style={{
            background: 'linear-gradient(135deg, #0d1257 0%, #1a237e 20%, #283593 40%, #3949ab 60%, #5c6bc0 80%, #7986cb 100%)',
            padding: '0', position: 'relative', overflow: 'hidden', height: '180px'
        }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '220px', height: '160px', opacity: 0.08, zIndex: 0, pointerEvents: 'none' as const }}>
                <img src="/images/deekshabhoomi-stupa.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} crossOrigin="anonymous" />
            </div>

            <div style={{ position: 'absolute', left: '14px', bottom: '0', width: '120px', height: '160px', zIndex: 3 }}>
                <img src="/images/ambedkar-formal.png" alt="Dr. B.R. Ambedkar" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom', filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.5))' }} crossOrigin="anonymous" />
            </div>

            <div style={{ position: 'absolute', right: '14px', bottom: '0', width: '110px', height: '150px', zIndex: 3 }}>
                <img src="/images/shivaji-maharaj.png" alt="Chhatrapati Shivaji Maharaj" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom', filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.5))' }} crossOrigin="anonymous" />
            </div>

            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '20px 150px 0' }}>
                <div style={{ fontSize: '42px', fontWeight: 900, color: 'white', letterSpacing: '5px', lineHeight: 1.15, textShadow: '0 3px 10px rgba(0,0,0,0.5)', marginBottom: '6px' }}>
                    {'\u0930\u093E\u0939\u0941\u0932 \u092E\u093F\u0924\u094D\u0930 \u092E\u0902\u0921\u0933'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '3px' }}>
                    {'\u092C\u093E\u0930\u0925\u0947 \u092C\u0938\u094D\u0924\u0940, \u0926\u093E\u092F\u094B\u0921\u0940 \u0917\u093E\u0935\u0920\u093E\u0923, \u092A\u0941\u0923\u0947-\u0967\u0968.'}
                </div>
            </div>

            <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(90deg, rgba(13,18,87,0.95), rgba(26,35,126,0.9), rgba(13,18,87,0.95))', padding: '10px 40px', textAlign: 'center', zIndex: 4, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: 'white', letterSpacing: '4px', lineHeight: 1.3, textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                    {'\u092D\u093E\u0930\u0924\u0930\u0924\u094D\u0928 \u0921\u0949. \u092C\u093E\u092C\u093E\u0938\u093E\u0939\u0947\u092C \u0906\u0902\u092C\u0947\u0921\u0915\u0930 \u091C\u092F\u0902\u0924\u0940 \u092E\u0939\u094B\u0924\u094D\u0938\u0935'}
                </div>
            </div>
        </div>

        {/* FORM BODY */}
        <div style={{ position: 'relative', padding: '28px 36px 24px', background: '#FFFFFF', minHeight: '300px' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '220px', opacity: 0.04, zIndex: 0, pointerEvents: 'none' as const }}>
                <img src="/images/deekshabhoomi-stupa.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} crossOrigin="anonymous" />
            </div>

            <div style={{ position: 'relative', zIndex: 2 }}>
                {/* Row 1 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a' }}>
                        {'\u092A\u093E\u0935\u0924\u0940 \u0915\u094D\u0930. : '}<span style={{ fontWeight: 900, color: '#1a237e', fontSize: '18px', borderBottom: '2px solid #333', paddingBottom: '2px', paddingLeft: '10px', paddingRight: '30px', display: 'inline-block', minWidth: '160px' }}>{slip.slip_number || 'N/A'}</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a' }}>
                        {'\u0926\u093F\u0928\u093E\u0902\u0915 : '}<span style={{ fontWeight: 900, color: '#1a237e', fontSize: '18px', borderBottom: '2px solid #333', paddingBottom: '2px', paddingLeft: '10px', paddingRight: '10px', display: 'inline-block', minWidth: '140px' }}>
                            {new Date(slip.confirmed_at || slip.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* Row 2 */}
                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '28px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', whiteSpace: 'nowrap', paddingRight: '10px' }}>{'\u0906\u092F\u0941.'}</div>
                    <div style={{ flex: 1, fontSize: '18px', fontWeight: 900, color: '#111', borderBottom: '2px solid #333', paddingBottom: '4px', paddingLeft: '10px', paddingRight: '10px', textAlign: 'left', minHeight: '24px' }}>{slip.name}</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', whiteSpace: 'nowrap', paddingLeft: '10px' }}>{'\u092F\u093E\u0902\u091C\u0915\u0921\u0942\u0928'}</div>
                </div>

                {/* Row 3 */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#111', borderBottom: '2px solid #333', paddingBottom: '4px', paddingLeft: '4px', minHeight: '24px' }}>
                        {slip.shop_name}{slip.location ? ` ,${slip.location}` : ''}{slip.address ? ` , ${slip.address}` : ''}
                    </div>
                </div>

                {/* Row 4 */}
                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '24px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', whiteSpace: 'nowrap', paddingRight: '10px' }}>{'\u092E\u094B\u092C\u093E\u0908\u0932'}</div>
                    <div style={{ flex: 1, fontSize: '17px', fontWeight: 900, color: '#111', borderBottom: '2px solid #333', paddingBottom: '4px', paddingLeft: '10px', minHeight: '24px', fontFamily: "'Segoe UI', monospace", letterSpacing: '1px' }}>{slip.mobile}</div>
                </div>

                {/* Row 5 */}
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px', lineHeight: 1.8, borderBottom: '2px solid #333', paddingBottom: '6px' }}>
                    {'\u092D\u093E\u0930\u0924\u0930\u0924\u094D\u0928 \u0921\u0949. \u092C\u093E\u092C\u093E\u0938\u093E\u0939\u0947\u092C \u0906\u0902\u092C\u0947\u0921\u0915\u0930 \u091C\u092F\u0902\u0924\u0940 \u092E\u0939\u094B\u0924\u094D\u0938\u0935\u093E\u0928\u093F\u092E\u093F\u0924\u094D\u0924 \u0905\u0915\u094D\u0937\u0930\u0940 \u0930\u0941\u092A\u092F\u0947'}
                </div>

                {/* Row 6 */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px', marginBottom: '16px', gap: '16px' }}>
                    <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #1a237e, #3949ab)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '22px', fontWeight: 900, boxShadow: '0 3px 10px rgba(26,35,126,0.35)', flexShrink: 0 }}>{'\u20B9'}</div>
                    <div style={{ flex: 1, fontSize: '34px', fontWeight: 900, color: '#1a237e', letterSpacing: '1px', lineHeight: 1, borderBottom: '2px solid #333', paddingBottom: '4px' }}>
                        {Number(slip.amount).toLocaleString('en-IN')}/-
                    </div>
                </div>

                {/* Row 7 */}
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginTop: '12px', marginBottom: '12px', lineHeight: 1.6, paddingTop: '8px' }}>
                    {'\u0926\u0947\u0923\u0917\u0940 \u0930\u094B\u0916 \u092E\u093F\u0933\u093E\u0932\u0940. \u0906\u092D\u093E\u0930\u0940 \u0906\u0939\u094B\u0924!'}
                </div>

                {slip.confirmed_by_name && (
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginTop: '4px' }}>
                        Confirmed by: <span style={{ fontWeight: 900, color: '#1a237e' }}>{slip.confirmed_by_name}</span>
                        {slip.confirmed_at && (
                            <span style={{ marginLeft: '8px', color: '#888' }}>
                                ({new Date(slip.confirmed_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })})
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* FOOTER */}
        <div style={{ background: 'linear-gradient(90deg, #0d1257, #1a237e, #283593, #1a237e, #0d1257)', padding: '20px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', background: '#FFD700', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a237e', fontSize: '24px', fontWeight: 900, boxShadow: '0 3px 10px rgba(0,0,0,0.3)' }}>{'\u20B9'}</div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#D32F2F', textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 30px rgba(211,47,47,0.3)', fontStyle: 'italic', letterSpacing: '5px' }}>{'\u0927\u0928\u094D\u092F\u0935\u093E\u0926!'}</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'white', letterSpacing: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>{'\u092A\u094D\u0930\u093E\u0938\u0915\u0930\u094D\u0924\u093E'}</div>
        </div>

        <div style={{ padding: '10px 36px', textAlign: 'center', background: '#0a0f3a' }}>
            <div style={{ fontSize: '11px', color: '#AAAACC', fontWeight: 700, letterSpacing: '5px', textTransform: 'uppercase' as const }}>
                Powered by <span style={{ color: '#FFD700', fontWeight: 900 }}>busyhub.in</span>
            </div>
        </div>
    </div>
);

export default SlipPreviewContent;

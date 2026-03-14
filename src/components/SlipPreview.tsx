import { VarganiSlip } from "@/types/admin";

/**
 * Professional cheque-style Vargani Slip.
 * Pure HTML/CSS — no background image dependency.
 * Uses Playfair Display (serif) for headers and Inter for body.
 * Landscape-oriented, compact, cheque-like proportions.
 */

const SlipPreviewContent = ({ slip }: { slip: VarganiSlip }) => (
    <div style={{
        width: '750px',
        background: '#FFFFFF',
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        position: 'relative',
        boxSizing: 'border-box' as const,
        border: '4px solid #0d47a1',
    }}>
        {/* Inner border */}
        <div style={{
            position: 'absolute', inset: '3px',
            border: '1.5px solid #5c6bc0',
            pointerEvents: 'none' as const, zIndex: 10,
        }} />

        {/* ==================== HEADER ==================== */}
        <div style={{
            background: 'linear-gradient(160deg, #0a1045 0%, #1a237e 35%, #283593 55%, #3949ab 80%, #1a237e 100%)',
            position: 'relative', overflow: 'hidden',
            height: '120px',
            display: 'flex', alignItems: 'stretch',
        }}>
            {/* Watermark behind header */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '160px', height: '110px',
                opacity: 0.06, zIndex: 0,
                pointerEvents: 'none' as const,
            }}>
                <img src="/images/deekshabhoomi-stupa.png" alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    crossOrigin="anonymous" />
            </div>

            {/* Left portrait — Dr. Ambedkar */}
            <div style={{
                width: '100px', flexShrink: 0,
                display: 'flex', alignItems: 'flex-end',
                justifyContent: 'center',
                paddingLeft: '8px', zIndex: 3,
            }}>
                <img src="/images/ambedkar-clean.png" alt="Dr. B.R. Ambedkar"
                    style={{
                        width: '88px', height: '105px',
                        objectFit: 'cover', objectPosition: 'top center',
                        borderRadius: '2px',
                    }}
                    crossOrigin="anonymous" />
            </div>

            {/* Center — Title + Address */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                zIndex: 2, padding: '8px 0',
            }}>
                <div style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '32px', fontWeight: 900, color: 'white',
                    letterSpacing: '4px', lineHeight: 1.1,
                    textShadow: '0 2px 6px rgba(0,0,0,0.4)',
                    fontStyle: 'italic', textAlign: 'center',
                }}>
                    RAHUL MITRA MANDAL
                </div>
                <div style={{
                    fontSize: '10.5px', fontWeight: 600,
                    color: 'rgba(255,255,255,0.8)',
                    letterSpacing: '2px', marginTop: '4px',
                    textAlign: 'center',
                }}>
                    Barthe Vasti, Dapodi, Pune-12.
                </div>
            </div>

            {/* Right portrait — Chhatrapati Shivaji Maharaj */}
            <div style={{
                width: '100px', flexShrink: 0,
                display: 'flex', alignItems: 'flex-end',
                justifyContent: 'center',
                paddingRight: '8px', zIndex: 3,
            }}>
                <img src="/images/sambhaji-maharaj.png" alt="Chhatrapati Shivaji Maharaj"
                    style={{
                        width: '85px', height: '100px',
                        objectFit: 'cover', objectPosition: 'top center',
                        borderRadius: '2px',
                    }}
                    crossOrigin="anonymous" />
            </div>
        </div>

        {/* ========== EVENT BANNER ========== */}
        <div style={{
            background: 'linear-gradient(90deg, #0a1045, #1a237e, #0a1045)',
            padding: '5px 20px', textAlign: 'center',
        }}>
            <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '12px', fontWeight: 700, color: 'white',
                letterSpacing: '3px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}>
                Bharat Ratna Dr. Babasaheb Ambedkar Jayanti Mahotsav
            </div>
        </div>

        {/* ==================== BODY ==================== */}
        <div style={{ padding: '14px 30px 14px', position: 'relative' }}>

            {/* Faint watermark */}
            <div style={{
                position: 'absolute', top: '45%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '180px', height: '130px',
                opacity: 0.035, zIndex: 0,
                pointerEvents: 'none' as const,
            }}>
                <img src="/images/deekshabhoomi-stupa.png" alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    crossOrigin="anonymous" />
            </div>

            <div style={{ position: 'relative', zIndex: 2 }}>

                {/* Row 1: Receipt No. + Date */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'baseline', marginBottom: '12px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                        <span style={{
                            fontSize: '12px', fontWeight: 700, color: '#333',
                            marginRight: '4px',
                        }}>Receipt No. :</span>
                        <span style={{
                            fontSize: '13px', fontWeight: 800, color: '#0d47a1',
                            borderBottom: '1px solid #888',
                            paddingBottom: '1px', paddingLeft: '6px',
                            display: 'inline-block', minWidth: '170px',
                            fontFamily: "'Inter', monospace",
                        }}>{slip.slip_number || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                        <span style={{
                            fontSize: '12px', fontWeight: 700, color: '#333',
                            marginRight: '4px',
                        }}>Date :</span>
                        <span style={{
                            fontSize: '13px', fontWeight: 800, color: '#0d47a1',
                            borderBottom: '1px solid #888',
                            paddingBottom: '1px', paddingLeft: '6px',
                            display: 'inline-block', minWidth: '110px',
                            fontFamily: "'Inter', monospace",
                        }}>
                            {new Date(slip.confirmed_at || slip.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit', month: '2-digit', year: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                {/* Row 2: Name */}
                <div style={{
                    display: 'flex', alignItems: 'baseline',
                    marginBottom: '12px',
                }}>
                    <span style={{
                        fontSize: '12px', fontWeight: 700, color: '#333',
                        minWidth: '60px',
                    }}>Name</span>
                    <span style={{
                        flex: 1, fontSize: '14px', fontWeight: 800, color: '#111',
                        borderBottom: '1px solid #888',
                        paddingBottom: '1px', paddingLeft: '8px',
                        minHeight: '18px',
                        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                    }}>{slip.name}</span>
                </div>

                {/* Row 3: From */}
                <div style={{
                    display: 'flex', alignItems: 'baseline',
                    marginBottom: '12px',
                }}>
                    <span style={{
                        fontSize: '12px', fontWeight: 700, color: '#333',
                        minWidth: '60px',
                    }}>From</span>
                    <span style={{
                        flex: 1, fontSize: '14px', fontWeight: 800, color: '#111',
                        borderBottom: '1px solid #888',
                        paddingBottom: '1px', paddingLeft: '8px',
                        minHeight: '18px',
                        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                    }}>
                        {slip.shop_name}{slip.location ? `, ${slip.location}` : ''}{slip.address ? `, ${slip.address}` : ''}
                    </span>
                </div>

                {/* Row 4: Address */}
                <div style={{
                    display: 'flex', alignItems: 'baseline',
                    marginBottom: '12px',
                }}>
                    <span style={{
                        fontSize: '12px', fontWeight: 700, color: '#333',
                        minWidth: '60px',
                    }}>Address</span>
                    <span style={{
                        flex: 1, fontSize: '14px', fontWeight: 800, color: '#111',
                        borderBottom: '1px solid #888',
                        paddingBottom: '1px', paddingLeft: '8px',
                        minHeight: '18px',
                        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                    }}>
                        {slip.address || ''}{slip.location ? `, ${slip.location}` : ''}
                    </span>
                </div>

                {/* Row 5: Mobile + Amount Box */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    marginBottom: '10px', gap: '14px',
                }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'baseline' }}>
                        <span style={{
                            fontSize: '12px', fontWeight: 700, color: '#333',
                            minWidth: '60px',
                        }}>Mobile</span>
                        <span style={{
                            flex: 1, fontSize: '14px', fontWeight: 800, color: '#111',
                            borderBottom: '1px solid #888',
                            paddingBottom: '1px', paddingLeft: '8px',
                            minHeight: '18px',
                            fontFamily: "'Inter', 'Consolas', monospace",
                            letterSpacing: '1.5px',
                        }}>{slip.mobile}</span>
                    </div>
                    {/* Red amount box */}
                    <div style={{
                        border: '2px solid #c62828',
                        borderRadius: '2px',
                        padding: '4px 12px',
                        display: 'flex', alignItems: 'center',
                        gap: '4px', flexShrink: 0,
                        background: '#fff',
                    }}>
                        <span style={{
                            fontSize: '18px', fontWeight: 900, color: '#c62828',
                            fontFamily: "'Inter', sans-serif",
                        }}>₹</span>
                        <span style={{
                            fontSize: '18px', fontWeight: 900, color: '#111',
                            letterSpacing: '0.5px',
                            fontFamily: "'Inter', sans-serif",
                        }}>
                            {Number(slip.amount).toLocaleString('en-IN')}/-
                        </span>
                    </div>
                </div>

                {/* Row 6: Occasion text */}
                <div style={{
                    fontSize: '10.5px', fontWeight: 600, color: '#444',
                    marginBottom: '4px', lineHeight: 1.4,
                    borderBottom: '1px solid #888',
                    paddingBottom: '3px',
                }}>
                    Bharat Ratna Dr. Babasaheb Ambedkar Jayanti Mahotsav donation in words rupees
                </div>

                {/* Row 7: Large amount */}
                <div style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '28px', fontWeight: 900, color: '#0d47a1',
                    letterSpacing: '1px', marginBottom: '10px',
                    lineHeight: 1.2,
                }}>
                    {Number(slip.amount).toLocaleString('en-IN')}/-
                </div>

                {/* Row 8: Confirmed by + Seal */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #ddd',
                    paddingTop: '6px',
                }}>
                    {slip.confirmed_by_name ? (
                        <div style={{ fontSize: '9px', fontWeight: 600, color: '#666', maxWidth: '300px' }}>
                            Confirmed by: <span style={{ fontWeight: 800, color: '#0d47a1' }}>{slip.confirmed_by_name}</span>
                            {slip.confirmed_at && (
                                <span style={{ marginLeft: '3px', color: '#999', fontSize: '8px' }}>
                                    ({new Date(slip.confirmed_at).toLocaleString('en-IN', {
                                        day: '2-digit', month: 'short', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit', hour12: true
                                    })})
                                </span>
                            )}
                        </div>
                    ) : <div />}

                    {/* Organization seal */}
                    <div style={{
                        width: '45px', height: '45px',
                        borderRadius: '50%', overflow: 'hidden',
                        opacity: 0.8, flexShrink: 0,
                        border: '1px solid rgba(13,71,161,0.15)',
                    }}>
                        <img src="/images/logo.png" alt="Seal"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            crossOrigin="anonymous" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default SlipPreviewContent;

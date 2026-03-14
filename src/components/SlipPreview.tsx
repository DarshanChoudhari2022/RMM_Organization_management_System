import { VarganiSlip } from "@/types/admin";

/**
 * Premium Cheque-Style Vargani Donation Receipt
 * ──────────────────────────────────────────────
 * Refined via Stitch MCP — professional bank-cheque aesthetic.
 * Features properly sized bust portraits, Playfair Display headings,
 * Inter body font, and an elegant donation confirmed outline badge.
 */

const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if (num === 0) return 'Zero';
    const c = (n: number): string => {
        if (n === 0) return '';
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
        return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + c(n % 100) : '');
    };
    let r = '';
    if (num >= 10000000) { r += c(Math.floor(num / 10000000)) + ' Crore '; num %= 10000000; }
    if (num >= 100000) { r += c(Math.floor(num / 100000)) + ' Lakh '; num %= 100000; }
    if (num >= 1000) { r += c(Math.floor(num / 1000)) + ' Thousand '; num %= 1000; }
    r += c(num);
    return r.trim() + ' Rupees Only';
};

/* ─── shared style tokens ─── */
const NAVY    = '#1a2a6c';
const BLUE    = '#2563eb';
const BODY_BG = 'linear-gradient(180deg, #eaeffa 0%, #f3f6fc 35%, #fafbff 65%, #ffffff 100%)';
const SERIF   = "'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS    = "'Inter', 'Segoe UI', Roboto, sans-serif";

const SlipPreviewContent = ({ slip }: { slip: VarganiSlip }) => {
    const date = new Date(slip.confirmed_at || slip.created_at);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const formattedDate = `${dd} / ${mm} / ${yyyy}`;
    const words = numberToWords(Number(slip.amount));
    const receiptNum = slip.slip_number || 'N/A';

    return (
        <div style={{
            width: '780px',
            fontFamily: SANS,
            background: '#fff',
            border: '2px solid #1e3a8a',
            overflow: 'hidden',
            boxSizing: 'border-box' as const,
        }}>

            {/* ═════════════════ HEADER ═════════════════ */}
            <div style={{
                background: `linear-gradient(145deg, #0f1b4d 0%, ${NAVY} 30%, #1e3a8a 55%, #2556b9 80%, ${NAVY} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'stretch',
                height: '115px',
            }}>
                {/* Left portrait — Dr. Ambedkar (properly sized bust) */}
                <div style={{
                    width: '105px', flexShrink: 0,
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    paddingLeft: '6px', zIndex: 2,
                }}>
                    <img src="/images/ambedkar-photo.png" alt="Dr. B.R. Ambedkar"
                        style={{
                            width: '94px', height: '110px',
                            objectFit: 'cover', objectPosition: 'top center',
                            borderRadius: '6px 6px 0 0',
                            border: '1.5px solid rgba(255,255,255,0.15)',
                            borderBottom: 'none',
                        }}
                        crossOrigin="anonymous" />
                </div>

                {/* Center title block */}
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    zIndex: 2, padding: '8px 6px',
                }}>
                    <div style={{
                        fontFamily: SERIF,
                        fontSize: '24px', fontWeight: 900, color: '#fff',
                        letterSpacing: '4px', lineHeight: 1,
                        fontVariant: 'small-caps',
                        textShadow: '0 2px 6px rgba(0,0,0,0.25)',
                        textAlign: 'center',
                    }}>
                        Rahul Mitra Mandal
                    </div>
                    <div style={{
                        fontSize: '8.5px', fontWeight: 500,
                        color: 'rgba(255,255,255,0.65)',
                        letterSpacing: '1.5px', marginTop: '5px', textAlign: 'center',
                    }}>
                        Barathe Vasti, Dapodi Gavthan, Pune – 12 · Pin 411012
                    </div>
                    <div style={{
                        fontSize: '9px', fontWeight: 700, color: '#FFD54F',
                        letterSpacing: '1.5px', marginTop: '6px', textAlign: 'center',
                        textShadow: '0 1px 3px rgba(0,0,0,0.25)',
                    }}>
                        ✦ Bharat Ratna Dr. Babasaheb Ambedkar Jayanti Mahotsav ✦
                    </div>
                </div>

                {/* Right portrait — Shivaji Maharaj (properly sized bust) */}
                <div style={{
                    width: '105px', flexShrink: 0,
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    paddingRight: '6px', zIndex: 2,
                }}>
                    <img src="/images/shivaji-photo.png" alt="Chhatrapati Shivaji Maharaj"
                        style={{
                            width: '92px', height: '108px',
                            objectFit: 'cover', objectPosition: 'top center',
                            borderRadius: '6px 6px 0 0',
                            border: '1.5px solid rgba(255,255,255,0.15)',
                            borderBottom: 'none',
                        }}
                        crossOrigin="anonymous" />
                </div>
            </div>

            {/* ═════════════════ RECEIPT BAR ═════════════════ */}
            <div style={{
                background: `linear-gradient(90deg, #1d4ed8, ${BLUE}, #1d4ed8)`,
                padding: '5px 24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Receipt No.:</span>{' '}
                    <span style={{ fontSize: '12px', fontWeight: 900, color: '#fff', fontFamily: SANS, letterSpacing: '0.5px' }}>{receiptNum}</span>
                </div>
                <div>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Date:</span>{' '}
                    <span style={{ fontSize: '12px', fontWeight: 900, color: '#fff', fontFamily: SANS }}>{formattedDate}</span>
                </div>
            </div>

            {/* ═════════════════ BODY ═════════════════ */}
            <div style={{
                background: BODY_BG,
                padding: '20px 28px 16px',
                position: 'relative',
                minHeight: '155px',
            }}>
                {/* Faint watermark */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.025, pointerEvents: 'none' as const, zIndex: 0,
                }}>
                    <img src="/images/deekshabhoomi-stupa.png" alt=""
                        style={{ width: '150px', height: '110px', objectFit: 'contain' }}
                        crossOrigin="anonymous" />
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>

                    {/* Row 1: Received From + Name directly next to it */}
                    <div style={{
                        display: 'flex', alignItems: 'baseline',
                        marginBottom: '16px',
                        borderBottom: '1px dotted #b0bec5',
                        paddingBottom: '6px',
                    }}>
                        <span style={{
                            fontSize: '12px', fontWeight: 700, color: '#37474f',
                            whiteSpace: 'nowrap', marginRight: '14px',
                        }}>Received From</span>
                        <span style={{
                            fontSize: '17px', fontWeight: 800, color: '#0f172a',
                            fontFamily: SERIF, fontStyle: 'italic',
                        }}>{slip.name}</span>
                    </div>

                    {/* Row 2: Event + Amount in Words label */}
                    <div style={{
                        fontSize: '10px', color: '#546e7a', fontWeight: 500,
                        marginBottom: '5px', lineHeight: 1.6,
                    }}>
                        For{' '}
                        <span style={{ fontWeight: 700, color: '#1e3a8a', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                            Bharat Ratna Dr. Babasaheb Ambedkar Jayanti Mahotsav
                        </span>
                        {' '}— Amount in Words:
                    </div>

                    {/* Row 3: Amount in words */}
                    <div style={{
                        fontSize: '13.5px', fontWeight: 700, color: '#0f172a',
                        fontStyle: 'italic',
                        borderBottom: '1px solid #cfd8dc',
                        paddingBottom: '6px',
                    }}>
                        {words}
                    </div>
                </div>
            </div>

            {/* ═════════════════ FOOTER ═════════════════ */}
            <div style={{
                background: 'linear-gradient(180deg, #f0f4ff 0%, #e8eef9 100%)',
                padding: '12px 28px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderTop: '1px solid #dbeafe',
            }}>
                {/* ₹ Amount Box */}
                <div style={{
                    border: '2px solid #2563eb',
                    borderRadius: '6px',
                    padding: '6px 18px',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: '#ffffff',
                    boxShadow: '0 1px 2px rgba(37,99,235,0.06)',
                }}>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: BLUE }}>₹</span>
                    <span style={{
                        fontSize: '18px', fontWeight: 900, color: '#0f172a',
                        letterSpacing: '0.5px',
                    }}>{Number(slip.amount).toLocaleString('en-IN')}</span>
                </div>

                {/* THANK YOU */}
                <div style={{
                    fontFamily: SERIF,
                    fontSize: '22px', fontWeight: 900,
                    color: '#c2410c',
                    letterSpacing: '2px',
                    fontVariant: 'small-caps',
                }}>Thank You !</div>

                {/* Donation Confirmed — elegant outline badge */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        border: '1.5px solid #16a34a',
                        borderRadius: '4px',
                        padding: '4px 10px',
                        background: 'rgba(22, 163, 74, 0.06)',
                    }}>
                        <span style={{
                            fontSize: '7.5px', fontWeight: 800,
                            color: '#15803d',
                            letterSpacing: '1px', textTransform: 'uppercase',
                            lineHeight: 1.3,
                        }}>DONATION<br />CONFIRMED</span>
                        <span style={{
                            color: '#16a34a', fontSize: '14px', fontWeight: 900,
                            lineHeight: 1,
                        }}>✓</span>
                    </div>
                    {slip.confirmed_by_name && (
                        <div style={{
                            fontSize: '7px', color: '#78909c', fontWeight: 700,
                            marginTop: '3px', textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}>{slip.confirmed_by_name}</div>
                    )}
                </div>
            </div>

            {/* Bottom accent */}
            <div style={{ height: '3px', background: `linear-gradient(90deg, #1e3a8a, ${BLUE}, #1e3a8a)` }} />
        </div>
    );
};

export default SlipPreviewContent;

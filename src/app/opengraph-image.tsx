import { ImageResponse } from 'next/og'
import { join } from 'path'
import { readFile } from 'fs/promises'

// Route segment config
export const runtime = 'nodejs'
// @ts-ignore
export const dynamic = 'force-static'

// Image metadata
export const alt = 'Mississauga Tamils Association'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
    // Read the transparent logo
    const logoData = await readFile(join(process.cwd(), 'public/mta-logo-transparent.png'))
    // @ts-ignore
    const logoSrc = logoData.buffer

    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    background: '#0f172a', // slate-900
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <img
                    // @ts-ignore
                    src={logoSrc}
                    alt="MTA Logo"
                    width="400"
                    height="400"
                    style={{
                        objectFit: 'contain'
                    }}
                />
                <div
                    style={{
                        marginTop: 40,
                        fontSize: 60,
                        color: 'white',
                        fontFamily: 'sans-serif',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <span>Mississauga Tamils Association</span>
                    <span style={{ fontSize: 30, marginTop: 10, opacity: 0.8 }}>Connecting the Community</span>
                </div>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}

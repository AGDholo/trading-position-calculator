import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  createTheme,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { teal } from '@mui/material/colors'

import './App.css'
import { ChangeEvent, useEffect, useState } from 'react'

const theme = createTheme({
  typography: {
    fontFamily: [
      'Catamaran',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    mode: 'light',
    background: {
      paper: teal[50],
    },
    primary: {
      main: teal[400],
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
})

interface priceState {
  open: number
  close: number
  stop: number
  initOpen: number
  initLeverage: number
}

function App() {
  const [price, setPrice] = useState<priceState>({
    open: 0,
    close: 0,
    stop: 0,
    initOpen: 0,
    initLeverage: 0,
  })

  const localInitOpen = localStorage.getItem('initOpen')

  const localInitLeverage = localStorage.getItem('initLeverage')

  useEffect(() => {
    setPrice({
      ...price,
      initOpen: parseInt(localInitOpen ? localInitOpen : '0'),
      initLeverage: parseInt(localInitLeverage ? localInitLeverage : '0'),
    })
  }, [price.initOpen, localInitOpen, localInitLeverage])

  const handleChange = (prop: keyof priceState) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setPrice({ ...price, [prop]: value })

    if (prop === 'initOpen') localStorage.setItem('initOpen', String(value))
    if (prop === 'initLeverage') localStorage.setItem('initLeverage', String(value))
  }

  const fractal = (num: number) => {
    if (num >= 1.1) {
      const res = num - Math.trunc(num)
      return 1 / (res * 100)
    } else {
      const res = num - Math.trunc(num)
      return (10 - res * 100) / 10
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Paper elevation={0}>
          <Container maxWidth={'md'}>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: '100vh' }}
            >
              <Card sx={{ width: '100%' }} variant={'outlined'}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  {((price.close / price.open) * price.initOpen - price.initOpen) /
                    ((price.open / price.stop) * price.initOpen - price.initOpen) <
                    1.05 && <Alert severity="error">Low ration, You should not open a position</Alert>}

                  <Box display={'flex'}>
                    <Box width={'100%'}>
                      <Box width={'100%'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box>
                          <Box display={'flex'} alignItems={'center'}>
                            <Typography variant={'h6'}>Open Position:</Typography>
                            <Typography variant={'h2'} sx={{ ml: 2 }} fontWeight={'bolder'}>
                              $
                              {price.open / price.stop > 1
                                ? ((price.initOpen / price.initLeverage) * fractal(price.open / price.stop)).toFixed(0)
                                : (price.initOpen / price.initLeverage).toFixed(0)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant={'h6'}>
                              Profit: {((price.close / price.open) * price.initOpen - price.initOpen).toFixed(2)}{' '}
                              {(price.close / price.open).toFixed(2)}%
                            </Typography>

                            <Typography variant={'h6'}>
                              Loss: {((price.open / price.stop) * price.initOpen - price.initOpen).toFixed(2)}{' '}
                              {(price.open / price.stop).toFixed(2)}%
                            </Typography>

                            <Typography variant={'h6'}>
                              Profit-loss ratio:{' '}
                              {(
                                ((price.close / price.open) * price.initOpen - price.initOpen) /
                                ((price.open / price.stop) * price.initOpen - price.initOpen)
                              ).toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>

                        <Box>
                          <Box>
                            <TextField
                              label={'Principal'}
                              value={price.initOpen}
                              onChange={handleChange('initOpen')}
                              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                              InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                              }}
                            />
                          </Box>

                          <Box mt={2}>
                            <TextField
                              label={'Leverage'}
                              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                              value={price.initLeverage}
                              onChange={handleChange('initLeverage')}
                              InputProps={{
                                startAdornment: <InputAdornment position="start">X</InputAdornment>,
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                <CardContent>
                  <TextField
                    label={'Open price'}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    fullWidth
                    value={price.open}
                    onChange={handleChange('open')}
                  />
                  <TextField
                    label={'Close price'}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    fullWidth
                    sx={{ my: 2 }}
                    value={price.close}
                    onChange={handleChange('close')}
                  />
                  <TextField
                    label={'Stop price'}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    fullWidth
                    value={price.stop}
                    onChange={handleChange('stop')}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Container>
        </Paper>
      </div>
    </ThemeProvider>
  )
}

export default App

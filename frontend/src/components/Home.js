
import { Box, Grid, Paper, Typography } from '@mui/material'

const Home = () => (
  <Paper elevation={3} sx={{ backgroundColor: 'rgb(209, 191, 227)', p: 2 }}>
    <Grid container spacing={3} alignItems="center" justifyContent="center">

      <Grid item xs={12} md={4}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="h4">
            Lauran Physio
          </Typography>
        </Box>
      </Grid>

      <Grid item md={8} sx={{ display: { xs: 'none', sm: 'block' } }} />

      <Grid item xs={12} md={4}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <img
            src="/images/laura.jpg"
            alt="My Image"
            style={{
              width: '200px',
              borderRadius: '50%'
            }}
          />
        </Box>
      </Grid>

      <Grid item xs={12} md={8}>
        <Typography variant="body1">
        Olen Laura, yhden lapsen äiti ja nopeasti kasvavan koiranpennun omistaja. Valmistuin Valviran rekisteröidyksi koulutetuksi hierojaksi 2015 ja siitä lähtien olen toiminut alalla. Haluan palvella asiakkaitani kokonaisvaltaisesti ja tällä hetkellä kartutan ammattitaitoani opiskelemalla fysioterapeutiksi. Olen opiskellut lisäksi vyöhyketerapiaa ja tutustunut muihin luontaishoitoihin. Teen Pienessä Kulmasalongissa klassisen, urheilu-, jalka- ja kokonaisvaltaisen hieronnan lisäksi intialaista päähierontaa.
        </Typography>
      </Grid>

    </Grid>
  </Paper >
)

export default Home
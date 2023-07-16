import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { useParams } from "react-router-dom";
import { WgerContainerRightSidebar } from "components/Core/Widgets/Container";
import React from "react";
import { LoadingPlaceholder } from "components/Core/LoadingWidget/LoadingWidget";
import { AddNutritionDiaryEntryFab } from "components/Nutrition/widgets/Fab";
import { PlanDetailDropdown } from "components/Nutrition/widgets/PlanDetailDropdown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Meal } from "components/Nutrition/models/meal";
import { MealItem } from "components/Nutrition/models/mealItem";
import { Add } from "@mui/icons-material";
import { useFetchNutritionalPlanQuery } from "components/Nutrition/queries";
import { MacrosPieChart } from "components/Nutrition/widgets/MacrosPieChart";
import { useTranslation } from "react-i18next";
import { NutritionalValues } from "components/Nutrition/helpers/nutritionalValues";
import { NutritionDiaryChart } from "components/Nutrition/widgets/NutritionDiaryChart";


const NutritionalValuesPlan = (props: { values: NutritionalValues }) => {
    const [t] = useTranslation();

    return <TableContainer>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>{t('nutrition.macronutrient')}</TableCell>
                    <TableCell>{t('total')}</TableCell>
                    <TableCell align="right">{t('nutrition.percentEnergy')}</TableCell>
                    <TableCell align="right">{t('nutrition.gPerBodyKg')}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>{t('nutrition.energy')}</TableCell>
                    <TableCell>
                        {t('nutrition.valueEnergyKcalKj', {
                            kcal: props.values.energy.toFixed(0),
                            kj: props.values.energyKj.toFixed(0)
                        })}
                    </TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>{t('nutrition.protein')}</TableCell>
                    <TableCell>
                        {t('nutrition.valueUnitG', { value: props.values.protein.toFixed(1) })}
                    </TableCell>
                    <TableCell align="right">
                        {t('nutrition.valueUnitPercent', { value: props.values.percent.protein.toFixed(1) })}
                    </TableCell>
                    <TableCell align="right">...</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>{t('nutrition.carbohydrates')}</TableCell>
                    <TableCell>
                        {t('nutrition.valueUnitG', { value: props.values.carbohydrates.toFixed(1) })}
                    </TableCell>
                    <TableCell align="right">
                        {t('nutrition.valueUnitPercent', { value: props.values.percent.carbohydrates.toFixed(1) })}
                    </TableCell>
                    <TableCell align="right">...</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ pl: 5 }}>{t('nutrition.ofWhichSugars')}</TableCell>
                    <TableCell>
                        {t('nutrition.valueUnitG', { value: props.values.carbohydratesSugar.toFixed(1) })}
                    </TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>{t('nutrition.fat')}</TableCell>
                    <TableCell>
                        {t('nutrition.valueUnitG', { value: props.values.fat.toFixed(1) })}
                    </TableCell>
                    <TableCell align="right">
                        {t('nutrition.valueUnitPercent', { value: props.values.percent.fat.toFixed(1) })}
                    </TableCell>
                    <TableCell align="right">...</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ pl: 5 }}>{t('nutrition.ofWhichFat')}</TableCell>
                    <TableCell>
                        {t('nutrition.valueUnitG', { value: props.values.fatSaturated.toFixed(1) })}
                    </TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>{t('nutrition.others')}</TableCell>
                    <TableCell> </TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>{t('nutrition.fibres')}</TableCell>
                    <TableCell>
                        {t('nutrition.valueUnitG', { value: props.values.fibres.toFixed(1) })}
                    </TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>{t('nutrition.sodium')}</TableCell>
                    <TableCell>
                        {t('nutrition.valueUnitG', { value: props.values.sodium.toFixed(1) })}
                    </TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>;
};

const MealItemListItem = (props: { mealItem: MealItem }) => {
    return <ListItem disablePadding>
        <ListItemText primary={props.mealItem.ingredient?.name} />
    </ListItem>;
};

const MealDetail = (props: { meal: Meal }) => {

    return <Card sx={{ minWidth: 275 }}>
        <CardHeader
            sx={{ bgcolor: "lightgray" }}
            action={
                <IconButton aria-label="settings" onClick={() => console.log(props.meal)}>
                    <MoreVertIcon />
                </IconButton>
            }
            title={props.meal.name}
            subheader={props.meal.time}
        />
        <CardContent>
            <List>
                {props.meal.items.map((item) => (
                    <MealItemListItem
                        mealItem={item}
                        key={item.id}
                    />
                ))}
            </List>
        </CardContent>
        <CardActions>
            <IconButton onClick={() => console.log(props)}>
                <Add />
            </IconButton>
        </CardActions>
    </Card>;
};


export const PlanDetail = () => {
    const [t] = useTranslation();
    const params = useParams<{ planId: string }>();
    const planId = parseInt(params.planId!);
    const planQuery = useFetchNutritionalPlanQuery(planId);

    return planQuery.isLoading
        ? <LoadingPlaceholder />
        : <WgerContainerRightSidebar
            title={planQuery.data!.description}
            optionsMenu={<PlanDetailDropdown plan={planQuery.data!} />}
            mainContent={
                <>
                    <Stack spacing={2}>
                        {planQuery.data!.meals.map(meal => <MealDetail meal={meal} key={meal.id} />)}
                        <Typography gutterBottom variant="h5">
                            {t('nutrition.nutritionalData')}
                        </Typography>
                        <NutritionalValuesPlan values={planQuery.data!.nutritionalValues} />
                        <MacrosPieChart data={planQuery.data!.nutritionalValues} />

                        <Typography gutterBottom variant="h5">
                            {t('nutrition.nutritionalDiary')}
                        </Typography>
                        <NutritionDiaryChart
                            planned={planQuery.data!.nutritionalValues}
                            today={planQuery.data!.nutritionalValuesDiaryToday}
                            avg7Days={planQuery.data!.nutritionalValues7DayAvg}
                        />
                    </Stack>
                </>
            }
            fab={<AddNutritionDiaryEntryFab plan={planQuery.data!} />}
        />;
};
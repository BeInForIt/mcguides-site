# Этап 1. Пар и бронза

!!! warning "Черновик"
    Числа посчитаны по рецептам мода, в игре ещё не сверены.

!!! info "Откуда числа"
    **[ядро]** — Modern Industrialization 2.4.2 без правок сборки.
    **[слой SKY]** — то, что меняет сборка All the Mods 10 To the Sky (ATM10SKY).
    **[источник]** — книга мода, квесты сборки, видеогайды: из них взята линия
    развития, но не числа. **[не проверено]** — вывод без подтверждения.

## 1. Ворота и вход

Вход — пустые руки: из мода ничего не нужно. Конец этапа — Forge Hammer,
Bronze Boiler и пять бронзовых машин: Bronze Furnace, Bronze Cutting Machine,
Bronze Macerator, Bronze Mixer, Bronze Compressor [ядро; набор — по квесту
сборки]. Какие из них нужны дальше, уточнит этап 2.

### Дерево ворот

Всё, что нужно для ворот, от сырья до машин. Маршрут «двойной слиток» с
молотом, ядро. Число на стрелке — сколько штук уходит, «x N» — сколько раз
выполняется рецепт.

```mermaid
flowchart LR
  n0["Bronze Compressor<br/>crafting x1"]
  n1["Bronze Mixer<br/>crafting x1"]
  n2["Bronze Macerator<br/>crafting x1"]
  n3["Bronze Cutting Machine<br/>crafting x1"]
  n4["fluid_pipes<br/>crafting x1"]
  n5(["minecraft:glass_pane<br/>1"])
  n6["Copper Rotor<br/>crafting x4"]
  n7["Copper Blade<br/>crafting x4"]
  n8["rods/copper<br/>forge hammer x2"]
  n9["Copper Curved Plate<br/>forge hammer x4"]
  n10["Bronze Curved Plate<br/>forge hammer x3"]
  n11["Bronze Machine Casing<br/>crafting x4"]
  n12["gears/bronze<br/>crafting x4"]
  n13["Bronze Ring<br/>forge hammer x1"]
  n14["Bronze Bolt<br/>forge hammer x2"]
  n15["gears/copper<br/>crafting x8"]
  n16["Copper Ring<br/>forge hammer x3"]
  n17["Copper Bolt<br/>forge hammer x6"]
  n18["plates/copper<br/>forge hammer x16"]
  n19["Copper Double Ingot<br/>forge hammer x31"]
  n20["ingots/copper<br/>furnace x62"]
  n21(["minecraft:diamond<br/>3"])
  n22["Bronze Furnace<br/>crafting x1"]
  n23["Bronze Boiler<br/>crafting x1"]
  n24["Fire Clay Bricks<br/>crafting x6"]
  n25["Fire Clay Brick<br/>furnace x24"]
  n26["Fire Clay Dust<br/>crafting x8"]
  n27["Brick Dust<br/>forge hammer x16"]
  n28(["minecraft:brick<br/>16"])
  n29(["minecraft:clay_ball<br/>16"])
  n30["Furnace<br/>crafting x2"]
  n31(["stone_crafting_materials<br/>16"])
  n32["Bronze Tank<br/>crafting x1"]
  n33(["glass_blocks<br/>5"])
  n34["plates/bronze<br/>forge hammer x33"]
  n35["Bronze Double Ingot<br/>forge hammer x39"]
  n36["ingots/bronze<br/>furnace x78"]
  n37["dusts/bronze<br/>crafting x26"]
  n38["dusts/tin<br/>forge hammer x7"]
  n39(["raw_materials/tin<br/>21"])
  n40["dusts/copper<br/>forge hammer x35"]
  n41(["raw_materials/copper<br/>105"])
  n42["Forge Hammer<br/>crafting x2"]
  n43["Heavy Weighted Pressure Plate<br/>crafting x6"]
  n44(["ingots/iron<br/>20"])
  n43 -->|6| n42
  n44 -->|12| n43
  n44 -->|8| n42
  n34 -->|4| n23
  n35 -->|33| n34
  n36 -->|78| n35
  n37 -->|78| n36
  n40 -->|78| n37
  n41 -->|105| n40
  n38 -->|26| n37
  n39 -->|21| n38
  n32 -->|1| n23
  n34 -->|8| n32
  n33 -->|1| n32
  n30 -->|1| n23
  n31 -->|16| n30
  n24 -->|3| n23
  n25 -->|24| n24
  n26 -->|24| n25
  n29 -->|16| n26
  n27 -->|16| n26
  n28 -->|16| n27
  n34 -->|5| n22
  n30 -->|1| n22
  n24 -->|3| n22
  n33 -->|2| n3
  n21 -->|1| n3
  n15 -->|2| n3
  n18 -->|32| n15
  n19 -->|16| n18
  n20 -->|62| n19
  n40 -->|62| n20
  n17 -->|32| n15
  n19 -->|6| n17
  n16 -->|8| n15
  n19 -->|3| n16
  n11 -->|1| n3
  n34 -->|32| n11
  n12 -->|4| n11
  n34 -->|16| n12
  n14 -->|16| n12
  n35 -->|2| n14
  n13 -->|4| n12
  n35 -->|1| n13
  n4 -->|3| n3
  n10 -->|6| n4
  n35 -->|3| n10
  n6 -->|2| n4
  n17 -->|16| n6
  n7 -->|16| n6
  n9 -->|8| n7
  n19 -->|4| n9
  n8 -->|4| n7
  n19 -->|2| n8
  n16 -->|4| n6
  n5 -->|1| n4
  n21 -->|2| n2
  n15 -->|3| n2
  n11 -->|1| n2
  n4 -->|3| n2
  n33 -->|2| n1
  n15 -->|1| n1
  n6 -->|2| n1
  n11 -->|1| n1
  n4 -->|3| n1
  n8 -->|2| n0
  n42 -->|1| n0
  n15 -->|2| n0
  n11 -->|1| n0
  n4 -->|3| n0
```

## 2. Машины

Ставятся по одной, линий на этапе нет: книга мода называет паровой век
временным и вкладываться в него не советует [источник: книга MI 2.4.2].

- **Forge Hammer** — два: один стоит, второй уходит в Bronze Compressor [ядро].
- **Bronze Boiler** — один держит четыре бронзовые машины: 8 mB/t пара на
  1500°, машина ест 2 mB/t [ядро]. Пятой машине при одновременной работе
  всех нужен второй бойлер: 9 raw copper, 3 raw tin, 8 brick, 8 clay ball,
  8 камня, 1 glass [ядро, маршрут «двойной слиток»].
- **Бронзовые машины** — base и max 2 EU/t, разгон за счёт efficiency у пара
  ничего не даёт. Время рецепта = eu × duration / 2: Bronze Macerator на raw
  copper (eu 2, 50 т) — 50 т = 2,5 с; Bronze Compressor на plate (eu 2,
  100 т) — 5 с [ядро].
- **Bronze Furnace** — eu 2, duration = время ванильного рецепта: те же
  10 с, что у обычной печи, но 400 mB пара на плавку. Один уголь — 80 плавок
  вместо 8 [ядро].

## 3. Прекрафты

Нет: машины этапа ручные (Forge Hammer работает только через своё окно, без
автоматизации), паровые машины этапа 2 их заменят. Первый прекрафт гайда —
Copper Wire на этапе 2 [источник: видеогайд Arenzale].

## 4. Через AE по запросу

Нет. Развилка «потоком или по запросу» объясняется на этапе 3.

## 5. Ресурсы

Ядро: raw copper — ванильная руда, raw tin — руда мода [ядро]. Сколько уходит
на ворота, зависит от того, ковать ли с молотом. Forge Hammer работает без
инструмента; с Iron Hammer в слоте выход лучше, но молот изнашивается
(прочность 1 666; молот — 5 Iron Large Plate = 20 Iron Plate) [ядро].

| Маршрут, ядро | raw copper | raw tin | Iron Hammer | Iron на молоты |
|---|---|---|---|---|
| без молота | 278 | 52 | 0 | 0 |
| с молотом, из двойных слитков | 105 | 21 | 4 | 100 |

Больше меди — ковать без молота; больше железа — с молотом. Двойной слиток
(2 слитка → 1, без молота) вдвое снижает износ на plate и rod. Медь с
молотом: raw → dust 3 → 4, и пыль в печь — на треть больше металла, чем
плавить raw [ядро]. Общее для обоих маршрутов: 20 iron ingot, 3 diamond,
5 glass, 1 glass pane, 16 clay ball, 16 камня; brick — 16 с молотом, 48 без.

**ATM10SKY.** Руды в мире нет — сырьё даёт сито Ex Deorum (crushed deepslate
и др. → copper / tin ore chunk), позже пчёлы [слой SKY; скорость сита не
посчитана]. Сборка убрала рецепт bronze dust мода на верстаке (3 + 1 → 3),
вместо него рецепт alltheores 3 + 1 → 4; шестерни alltheores — 4 слитка +
iron nugget [слой SKY]. Молоты alltheores на верстаке гайд не советует: они
изнашиваются за каждый крафт, и такой автокрафт трудно настроить.

| Маршрут, слой SKY | raw copper | raw tin | Iron Hammer | Iron на молоты |
|---|---|---|---|---|
| без молота | 162 | 32 | 0 | 0 |
| с молотом, из двойных слитков | 78 | 15 | 2 | 60 |

Steam Quarry — пропустить [источник: видеогайд Arenzale]; в ATM10SKY в нём
antimony вместо zinc [слой SKY].

## 6. Энергия

- Бойлер на угле: 1 coal = 1 600 т горения × 20 = 32 000 mB пара = 200 с
  бронзового бойлера на максимуме [ядро; время горения — NeoForge 21.1.221].
  Четыре машины — 18 угля в час на бойлер; вода 0,5 mB/t (16 mB пара из
  1 mB воды) [ядро].
- Прогрев с нуля до 1500° при полном отборе — 3 905 т (3 мин 15 с); за это
  время бойлер отдаёт 19 232 mB [ядро].
- Топливо в простое не сгорает: пару некуда деться, тепло не уходит. Теряется
  только запас тепла, 12 000 EU, когда бойлер остывает [ядро].
- Gunpowder правым кликом — ×2 к скорости на 2 400 т (2 мин) за штуку; пара
  на рецепт столько же, машина ест 4 mB/t, бойлер держит две такие. Таймер
  идёт и в простое [ядро]. Рецепты eu 3–4 под порохом в бронзовых машинах,
  видимо, запускаются [не проверено].

## 7. Время этапа и узкое место

Ручная часть — верстак и Forge Hammer — не считается: время зависит от
игрока. Считается плавка: ворота — 164 плавки (маршрут «двойной») или 508
(без молота) по 10 с — 27 мин или 85 мин одной обычной печью; угля 20,5 и
63,5 [ядро]. Узкое место — плавка и добыча руды: восемь печей сжимают плавку
до 3,5 и 11 мин [не проверено: печи загружены поровну].

## 8. Проверка в игре

Что замерить и чего ждать:

1. Bronze Boiler с нуля, уголь, четыре машины забирают пар: 1500° через
   ~195 с (3 905 т).
2. Он же на максимуме: один coal держит 8 mB/t ровно 200 с.
3. Bronze Macerator, raw copper: одна штука за 2,5 с; под порохом — 1,25 с.
4. Bronze Furnace: плавка 10 с, 400 mB пара.
5. Ворота на маршруте «двойной»: на руки ушло 105 raw copper и 21 raw tin
   (ядро) или 78 и 15 (ATM10SKY).

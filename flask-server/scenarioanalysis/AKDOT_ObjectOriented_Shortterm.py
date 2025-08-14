import pandas as pd
import calendar
from datetime import datetime, timedelta
import simpy
import random
import numpy as np
from datetime import datetime
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from scenarioanalysis import *
from flask import current_app
import json
import os
from collections import defaultdict

###############################################################################
#                             VIDEO LINK MANAGER                              #
###############################################################################

def get_video_links(block, in_out_route):
    videos_dictionary_sections = {
        'Section 1': 'https://youtu.be/ZzP9m2a6tu8',
        'Section 2': 'https://youtu.be/sf7Z7N8GeZo',
        'Section 3': 'https://youtu.be/FX6_zELGAw4',
        'Section 4': 'https://youtu.be/WurVYVKAOjo',
        'Section 5': 'https://youtu.be/_XmFWDPR7B8',
        'Section 6': 'https://youtu.be/0rZ8zQWG7IE',
        'Section 7': 'https://youtu.be/4TygqOW-lwQ',
        'Section 8': 'https://youtu.be/lT-6GukIviA',
        'Section 9': 'No specific video found'
    }
    videos_dictionary_routes = {
        'Insulfoam-Insulfoam': 'https://youtu.be/3KzU9KRVoWI',
        'Insulfoam-Military': 'https://youtu.be/UkLgMqMTxZg',
        'Military-Insulfoam': 'https://youtu.be/_yHpdqUcARc',
        'Military-Military': 'https://youtu.be/cBokCHM10Wk',
        'Marathon-Military': 'https://youtu.be/mUyvtxAP4zw',
        'Military-Marathon': 'https://youtu.be/HtfOFxKr_B8',
        'Marathon-Marathon': 'https://youtu.be/eHKcqA9KRTs',
        'ABI-Military': 'https://youtu.be/nHuN5t2B9fI',
        'Military-ABI': 'https://youtu.be/MhmopqJD3FM',
        'ABI-ABI': 'https://youtu.be/xDGJrYZeUCk',
        'ABI-Roger': 'Situation Not Possible',
        'Roger-ABI': 'https://youtu.be/Ztc7qL2tz5c',
        'Roger-Roger': 'Situation Not Possible',
        'Roger-Transit': 'https://youtu.be/0_5laDRaC_8',
        'Transit-Transit': 'https://youtu.be/6fjrdVjUCFw',
        'ABI-PetroStar': 'https://youtu.be/-6q3lxSxhiA',
        'Marathon-PetroStar': 'https://youtu.be/Jpmh-XndfuE',
        'PetroStar-ABI': 'https://youtu.be/fIQPxQiyxJs',
        'Tidewater-Tidewater': 'https://youtu.be/br55TbzjZAU',
        'Track J-Track J': 'https://youtu.be/OczCBPOJxtY',
        'Track J-Insulfoam': 'https://youtu.be/3YeQW0h056I',
        'Insulfoam-Track J': 'https://youtu.be/Cm63Ogw-FxA',
        'Track J-Marathon': 'https://youtu.be/Wi1LbmD5LEU',
        'Marathon-Track J': 'https://youtu.be/mCzottnXMEo',
        'Track J-ABI': 'https://youtu.be/uJHPqry7MpQ',
        'ABI-Track J': 'https://youtu.be/dskH4hbyeq0',
        'ABI-Marathon': 'https://youtu.be/YepY9-EfHOI',
        'Marathon-ABI': 'https://youtu.be/qLtuyER5cqg',
        'Marathon Transit Area Hybrid-Marathon Transit Area Hybrid': 'https://youtu.be/eHKcqA9KRTs',
        'Military-Marathon Transit Area Hybrid': 'https://youtu.be/HtfOFxKr_B8',
        'Marathon Transit Area Hybrid-Military': 'https://youtu.be/mUyvtxAP4zw'    
    }
    video_while_running = videos_dictionary_sections.get(block)
    video_after_running = videos_dictionary_routes.get(in_out_route)
    return video_while_running, video_after_running

class VideoLinkManager:
    """
    Returns two video links based on the block location and route.
    """
    videos_dictionary_sections = {
        'Section 1': 'https://youtu.be/ZzP9m2a6tu8',
        'Section 2': 'https://youtu.be/sf7Z7N8GeZo',
        'Section 3': 'https://youtu.be/FX6_zELGAOw4',
        'Section 4': 'https://youtu.be/WurVYVKAOjo',
        'Section 5': 'https://youtu.be/_XmFWDPR7B8',
        'Section 6': 'https://youtu.be/0rZ8zQWG7IE',
        'Section 7': 'https://youtu.be/4TygqOW-lwQ',
        'Section 8': 'https://youtu.be/lT-6GukIviA',
        'Section 9': 'No specific video found'
    }
    videos_dictionary_routes = {
        'Insulfoam-Insulfoam': 'https://youtu.be/3KzU9KRVoWI',
        'Insulfoam-Military': 'https://youtu.be/UkLgMqMTxZg',
        'Military-Insulfoam': 'https://youtu.be/_yHpdqUcARc',
        'Military-Military': 'https://youtu.be/cBokCHM10Wk',
        'Marathon-Military': 'https://youtu.be/mUyvtxAP4zw',
        'Military-Marathon': 'https://youtu.be/HtfOFxKr_B8',
        'Marathon-Marathon': 'https://youtu.be/eHKcqA9KRTs',
        'ABI-Military': 'https://youtu.be/nHuN5t2B9fI',
        'Military-ABI': 'https://youtu.be/MhmopqJD3FM',
        'ABI-ABI': 'https://youtu.be/xDGJrYZeUCk',
        'ABI-Roger': 'Situation Not Possible',
        'Roger-ABI': 'https://youtu.be/Ztc7qL2tz5c',
        'Roger-Roger': 'Situation Not Possible',
        'Roger-Transit': 'https://youtu.be/0_5laDRaC_8',
        'Transit-Transit': 'https://youtu.be/6fjrdVjUCFw',
        'ABI-PetroStar': 'https://youtu.be/-6q3lxSxhiA',
        'Marathon-PetroStar': 'https://youtu.be/Jpmh-XndfuE',
        'PetroStar-ABI': 'https://youtu.be/fIQPxQiyxJs',
        'Tidewater-Tidewater': 'https://youtu.be/br55TbzjZAU',
        'Track J-Track J': 'https://youtu.be/OczCBPOJxtY',
        'Track J-Insulfoam': 'https://youtu.be/3YeQW0h056I',
        'Insulfoam-Track J': 'https://youtu.be/Cm63Ogw-FxA',
        'Track J-Marathon': 'https://youtu.be/Wi1LbmD5LEU',
        'Marathon-Track J': 'https://youtu.be/mCzottnXMEo',
        'Track J-ABI': 'https://youtu.be/uJHPqry7MpQ',
        'ABI-Track J': 'https://youtu.be/dskH4hbyeq0',
        'ABI-Marathon': 'https://youtu.be/YepY9-EfHOI',
        'Marathon-ABI': 'https://youtu.be/qLtuyER5cqg',
        'Marathon Transit Area Hybrid-Marathon Transit Area Hybrid': 'https://youtu.be/eHKcqA9KRTs',
        'Military-Marathon Transit Area Hybrid': 'https://youtu.be/HtfOFxKr_B8',
        'Marathon Transit Area Hybrid-Military': 'https://youtu.be/mUyvtxAP4zw'      
    }

    @classmethod
    def get_video_links(cls, block, route):
        vid_while_running = cls.videos_dictionary_sections.get(block, "No video for this block")
        vid_after_running = cls.videos_dictionary_routes.get(route, "No video for this route")
        return vid_while_running, vid_after_running

###############################################################################
#                         TRAFFIC DATA GENERATOR                              #
###############################################################################

class TrafficDataGenerator:
    def __init__(self, excel_file):
        self.excel_file = excel_file
        self.data_dict = defaultdict(list)
        self._load_sheets()

    @staticmethod
    def _get_first_day_of_month_day_of_week(year, month_abbr):
        month_number = datetime.strptime(month_abbr, '%b').month
        return (datetime(year, month_number, 1).weekday() + 1) % 7

    def _load_sheets(self):
        xls = pd.ExcelFile(self.excel_file)
        for sheet in xls.sheet_names:
            month_abbr, year_str = sheet.split('-')
            year = int(year_str)
            first_day_of_week = self._get_first_day_of_month_day_of_week(year, month_abbr)
            df = pd.read_excel(xls, sheet_name=sheet, header=None)

            for day_index in range(df.shape[1]):
                day_of_week = (first_day_of_week + day_index) % 7
                for hour in range(df.shape[0]):
                    val = df.iloc[hour, day_index]
                    if val >= 0:
                        self.data_dict[(month_abbr, day_of_week, hour)].append(val)

    @staticmethod
    def parse_date(block_date):
        date_obj = datetime.strptime(block_date, '%d %b %Y')
        month_abbr = date_obj.strftime('%b')
        day_of_week = (date_obj.weekday() + 1) % 7
        return month_abbr, day_of_week

    def calculate_average_arrivals(self, month_abbr, day_of_week, hour):
        key = (month_abbr, day_of_week, hour)
        values = self.data_dict.get(key, [])
        return sum(values) / len(values) if values else 0.0

    def generate_one_hour_arrivals(self, month_abbr, day_of_week, hour):
        avg = self.calculate_average_arrivals(month_abbr, day_of_week, hour)
        num_arrivals = np.random.poisson(avg)
        arrs = np.random.uniform(0, 3600, num_arrivals)
        return np.sort(np.round(arrs).astype(int))

    def generate_cumulative_arrivals(self, block_duration, block_date, block_hour):
        month_abbr, day_of_week = self.parse_date(block_date)
        total_hours = 2 + block_duration / 3600 + 5
        final_arrivals = []

        for offset_hour in range(int(block_hour - 2), int(block_hour - 2 + total_hours)):
            norm_hour = offset_hour % 24
            hour_arrs = self.generate_one_hour_arrivals(month_abbr, day_of_week, norm_hour)

            if offset_hour >= 24:
                days_passed = offset_hour // 24
                t_adj = ((norm_hour + days_passed * 24) - block_hour + 2) * 3600
            else:
                t_adj = (norm_hour - block_hour + 2) * 3600

            adjusted = [a + t_adj for a in hour_arrs]
            final_arrivals.extend(adjusted)

        return sorted(final_arrivals)

###############################################################################
#                                VEHICLE CLASS                                #
###############################################################################
class Vehicle:
    """
    Simulates an individual vehicle including check-in, travel,
    potential delays due to block, and additional processes (hazmat, maintenance).
    """
    block_map = {
        'Section 1': 'Ocean to Gate',
        'Section 2': 'Gate to First Fork',
        'Section 3': 'First Fork to Second Fork',
        'Section 4': 'First Fork to Second Fork',
        'Section 5': 'Second Fork to Tote',
        'Section 6': 'Second Fork to Tote',
        'Section 7': 'Second Fork to Matson',
        'Section 8': 'Second Fork to Matson',
        'Section 9': 'hybrid to Matson'
    }

    def __init__(self, env, name, vehicle_type,
                 check_in, Marathon_gate, hazmat_lane,
                 block, route, block_start, block_end,
                 scenario, arrival_time):
        self.env = env
        self.name = name
        self.vehicle_type = vehicle_type
        self.check_in = check_in
        self.Marathon_gate = Marathon_gate
        self.hazmat_lane = hazmat_lane
        self.block = block
        self.route = route
        self.block_start = block_start
        self.block_end = block_end
        self.scenario = scenario
        self.arrival_time = arrival_time
        self.unloading_loading = 0
        self.maintenance_process = 0
        self.haz_pross = 0

    def run(self):
        # Wait until arrival time
        yield self.env.timeout(self.arrival_time)
        arrival_time_sim = self.env.now

        # Decide destination
        if self.vehicle_type == "Truck":
            destination = random.randint(1, 2)  # 1=Matson, 2=Tote
        else:
            destination = 1 if random.random() < 0.5 else 2

        route_to, route_from = self._select_route(destination)

        # Gate check
        if route_to and "Marathon" in route_to[0]:
            with self.Marathon_gate.request() as mg_req:
                yield mg_req
                check_in_time = random.randint(10, 20)
                yield self.env.timeout(check_in_time)
        else:
            with self.check_in.request() as ch_req:
                yield ch_req
                check_in_time = random.randint(10, 20)
                yield self.env.timeout(check_in_time)

        # Travel "to" route
        travel_time_to_container = [0]
        yield self.env.process(self._move_along_route(route_to, travel_time_to_container))
        travel_time_to = travel_time_to_container[0]

        # If truck: additional tasks
        if self.vehicle_type == "Truck":
            self.unloading_loading = random.uniform(600, 900)
            yield self.env.timeout(self.unloading_loading)
            if random.random() < 0.125:
                with self.hazmat_lane.request() as hz_req:
                    arr_h = self.env.now
                    yield hz_req
                    start_h = self.env.now
                    haz_proc = random.randint(5, 15)
                    yield self.env.timeout(haz_proc)
                    end_h = self.env.now
                    self.haz_pross = end_h - start_h
                    wait_h = start_h - arr_h
                    self.env.parent_env.hazmat_waits.append(wait_h)
                    self.env.parent_env.num_of_hazmat += 1

            if random.random() < 0.1:
                self.maintenance_process = random.randint(600, 900)
                yield self.env.timeout(self.maintenance_process)

        # Travel "from" route
        travel_time_from_container = [0]
        yield self.env.process(self._move_along_route(route_from, travel_time_from_container))
        travel_time_from = travel_time_from_container[0]

        end_time = self.env.now
        cycle_time = end_time - arrival_time_sim

        if self.vehicle_type == "Truck":
            waiting_time = cycle_time - travel_time_to - travel_time_from \
                           - self.unloading_loading - self.haz_pross - self.maintenance_process
        else:
            waiting_time = cycle_time - travel_time_to - travel_time_from

        self.env.parent_env.waiting_times.append(waiting_time)
        if self.vehicle_type == "Truck":
            self.env.parent_env.cycle_times.append(cycle_time)

        self.env.parent_env.all_results.append({
            "vehicle_name": self.name,
            "type": self.vehicle_type,
            "scenario": self.scenario,
            "block": self.block,
            "route": self.route,
            "arrival_time": arrival_time_sim,
            "travel_time_to": travel_time_to,
            "travel_time_from": travel_time_from,
            "unloading_loading": self.unloading_loading,
            "maintenance_process": self.maintenance_process,
            "haz_pross": self.haz_pross,
            "waiting_time": waiting_time,
            "cycle_time": cycle_time
        })

    def _select_route(self, destination):
        # Define initial routes
        init_to_matson = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson']
        init_from_matson = ['Second Fork to Matson','First Fork to Second Fork','Gate to First Fork','Ocean to Gate']
        init_to_tote = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
        init_from_tote = ['Second Fork to Tote','First Fork to Second Fork','Gate to First Fork','Ocean to Gate']
    
        # Map block sections to their blocked segment
        blockage_segments = {
            'Section 1': 'Ocean to Gate',
            'Section 2': 'Gate to First Fork',
            'Section 3': 'First Fork to Second Fork',
            'Section 4': 'First Fork to Second Fork',
            'Section 5': 'Second Fork to Tote',
            'Section 6': 'Second Fork to Tote',
            'Section 7': 'Second Fork to Matson',
            'Section 8': 'Second Fork to Matson',
            'Section 9': 'hybrid to Matson'
        }
    
        # For normal and no_reaction scenarios, just return the initial routes
        if self.scenario in ['normal', 'no_reaction']:
            if destination == 1:  # Matson
                return init_to_matson, init_from_matson
            else:
                return init_to_tote, init_from_tote
    
        # If detour scenario:
        if self.scenario == 'detour':
            # Default to initial routes
            if destination == 1:
                route_to = init_to_matson[:]
                route_from = init_from_matson[:]
            else:
                route_to = init_to_tote[:]
                route_from = init_from_tote[:]
    
            # Section-based adjustments
            if self.block == 'Section 1':
                if self.route == 'Insulfoam-Insulfoam':
                    if destination == 1:
                        route_to = ['Insulfoam to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson']
                        route_from = ['Second Fork to Matson','First Fork to Second Fork','Gate to First Fork','Insulfoam to Gate']
                    else:
                        route_to = ['Insulfoam to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Second Fork to Tote','First Fork to Second Fork','Gate to First Fork','Insulfoam to Gate']
    
                elif self.route == 'Insulfoam-Military':
                    if destination == 1:
                        route_to = ['Insulfoam to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson']
                        route_from = ['Matson to Military']
                    else:
                        route_to = ['Tote to Military']
                        route_from = ['Insulfoam to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
    
                elif self.route == 'Military-Insulfoam':
                    if destination == 1:
                        route_to = ['Matson to Military']
                        route_from = ['Insulfoam to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson']
                    else:
                        route_to = ['Insulfoam to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Tote to Military']
    
                elif self.route == 'Military-Military':
                    if destination == 1:
                        route_to = ['Matson to Military']
                        route_from = ['Matson to Military']
                    else:
                        route_to = ['Tote to Military']
                        route_from = ['Tote to Military']
    
            elif self.block == 'Section 2':
                if self.route == 'Marathon-Military':
                    if destination == 1:
                        route_to = ['Marathon to Matson']
                        route_from = ['Matson to Military']
                    else:
                        route_to = ['Marathon to second Fork','Second Fork to Tote']
                        route_from = ['Tote to Military']
    
                elif self.route == 'Marathon-Marathon':
                    if destination == 1:
                        route_to = ['Marathon to Matson']
                        route_from = ['Marathon to Matson']
                    else:
                        route_to = ['Marathon to second Fork','Second Fork to Tote']
                        route_from = ['Marathon to second Fork','Second Fork to Tote']
    
                elif self.route == 'Military-Marathon':
                    if destination == 1:
                        route_to = ['Matson to Military']
                        route_from = ['Marathon to Matson']
                    else:
                        route_to = ['Tote to Military']
                        route_from = ['Marathon to second Fork','Second Fork to Tote']
    
                elif self.route == 'Military-Military':
                    if destination == 1:
                        route_to = ['Matson to Military']
                        route_from = ['Matson to Military']
                    else:
                        route_to = ['Tote to Military']
                        route_from = ['Tote to Military']
    
                elif self.route == 'Bluff-Marathon':
                    if destination == 1:
                        route_to = ['Bluff to first fork','First Fork to Second Fork','Second Fork to Matson']
                        route_from = ['Marathon to Matson']
                    else:
                        route_to = ['Bluff to first fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Marathon to second Fork','Second Fork to Tote']
    
                elif self.route == 'Marathon-Bluff':
                    if destination == 1:
                        route_to = ['Marathon to Matson']
                        route_from = ['Bluff to first fork','First Fork to Second Fork','Second Fork to Matson']
                    else:
                        route_to = ['Marathon to second Fork','Second Fork to Tote']
                        route_from = ['Bluff to first fork','First Fork to Second Fork','Second Fork to Tote']
    
                elif self.route == 'Bluff-Military':
                    if destination == 1:
                        route_to = ['Bluff to first fork','First Fork to Second Fork','Second Fork to Matson']
                        route_from = ['Marathon to Matson']
                    else:
                        route_to = ['Bluff to first fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Marathon to second Fork','Second Fork to Tote']
    
                elif self.route == 'Military-Bluff':
                    if destination == 1:
                        route_to = ['Bluff to first fork','First Fork to Second Fork','Second Fork to Matson']
                        route_from = ['Marathon to Matson']
                    else:
                        route_to = ['Bluff to first fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Marathon to second Fork','Second Fork to Tote']
    
                elif self.route == 'Bluff-Bluff':
                    if destination == 1:
                        route_to = ['Bluff to first fork','First Fork to Second Fork','Second Fork to Matson']
                        route_from = ['Marathon to Matson']
                    else:
                        route_to = ['Bluff to first fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Marathon to second Fork','Second Fork to Tote']
    
                elif self.route == 'Marathon Transit Area Hybrid-Marathon Transit Area Hybrid':
                    if destination == 1:
                        route_to = ['hybrid to Matson']
                        route_from = ['hybrid to Matson']
                    else:
                        route_to = ['hybrid to Tote']
                        route_from = ['hybrid to Tote']
    
            elif self.block == 'Section 3':
                if self.route == 'Marathon Transit Area Hybrid-Marathon Transit Area Hybrid':
                    if destination == 1:
                        route_to = ['hybrid to Matson']
                        route_from = ['hybrid to Matson']
                    else:
                        route_to = ['hybrid to Tote']
                        route_from = ['hybrid to Tote']
    
                elif self.route == 'Marathon Transit Area Hybrid-Military':
                    if destination == 1:
                        route_to = ['hybrid to Matson']
                        route_from = ['Matson to Military']
                    else:
                        route_to = ['hybrid to Tote']
                        route_from = ['Matson to Tote']
    
                elif self.route == 'Military-Marathon Transit Area Hybrid':
                    if destination == 1:
                        route_to = ['Matson to Military']
                        route_from = ['hybrid to Matson']
                    else:
                        route_to = ['Tote to Military']
                        route_from = ['hybrid to Tote']
    
                elif self.route == 'Military-Military':
                    if destination == 1:
                        route_to = ['Matson to Military']
                        route_from = ['Matson to Military']
                    else:
                        route_to = ['Tote to Military']
                        route_from = ['Tote to Military']
    
            elif self.block == 'Section 4':
                if self.route == 'ABI-Roger':
                    if destination == 1:
                        route_to = ['Gate to First Fork','First Fork to Matson through ABI']
                        route_from = ['Gate to First Fork','Roger','Roger to Matson']
                    else:
                        route_to = ['Gate to First Fork','First Fork to Second Fork through ABI','Second Fork to Tote']
                        route_from = ['Gate to First Fork','Roger','Roger to Tote']
    
                elif self.route == 'Roger-ABI':
                    if destination == 1:
                        route_to = ['Gate to First Fork','Roger','Roger to Matson']
                        route_from = ['Gate to First Fork','First Fork to Matson through ABI']
                    else:
                        route_to = ['Gate to First Fork','Roger','Roger to Tote']
                        route_from = ['Gate to First Fork','First Fork to Second Fork through ABI','Second Fork to Tote']
    
                elif self.route == 'ABI-ABI':
                    if destination == 1:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Matson through ABI']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Matson through ABI']
                    else:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork through ABI','Second Fork to Tote']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork through ABI','Second Fork to Tote']
    
                elif self.route == 'Roger-Roger':
                    if destination == 1:
                        route_to = ['Gate to First Fork','Roger','Roger to Matson']
                        route_from = ['Gate to First Fork','Roger','Roger to Matson']
                    else:
                        route_to = ['Gate to First Fork','Roger','Roger to Tote']
                        route_from = ['Gate to First Fork','Roger','Roger to Tote']
    
                elif self.route == 'ABI-Military':
                    if destination == 1:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Matson through ABI']
                        route_from = ['Matson to Military']
                    else:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork through ABI','Second Fork to Tote']
                        route_from = ['Tote to Military']
    
                elif self.route == 'Military-ABI':
                    if destination == 1:
                        route_to = ['Matson to Military']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Matson through ABI']
                    else:
                        route_to = ['Tote to Military']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork through ABI','Second Fork to Tote']
    
                elif self.route == 'Military-Military':
                    if destination == 1:
                        route_to = ['Matson to Military']
                        route_from = ['Matson to Military']
                    else:
                        route_to = ['Tote to Military']
                        route_from = ['Tote to Military']
    
                elif self.route == 'Marathon Transit Area Hybrid-Marathon Transit Area Hybrid':
                    if destination == 1:
                        route_to = ['hybrid to Matson']
                        route_from = ['hybrid to Matson']
                    else:
                        route_to = ['hybrid to Tote']
                        route_from = ['hybrid to Tote']
    
            elif self.block == 'Section 5':
                if self.route == 'Military-Military':
                    if destination == 1:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson']
                    else:
                        route_to = ['Tote to Military']
                        route_from = ['Tote to Military']
    
                elif self.route == 'Roger-Military':
                    if destination == 1:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson']
                    else:
                        route_to = ['Gate to First Fork','Roger','Roger to Tote']
                        route_from = ['Tote to Military']
    
                elif self.route == 'Military-Roger':
                    if destination == 1:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson']
                    else:
                        route_to = ['Tote to Military']
                        route_from = ['Gate to First Fork','Roger','Roger to Tote']
    
            elif self.block == 'Section 6':
                if self.route == 'Transit-Transit':
                    if destination == 1:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson']
                    else:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote through Transit']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote through Transit']
                elif self.route == 'Military-Military':
                    if destination == 1:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson']
                    else:
                        route_to = ['Tote to Military']
                        route_from = ['Tote to Military']
    
            elif self.block == 'Section 7':
                if self.route == 'Marathon Transit Area Hybrid-Military':
                    if destination == 1:
                        route_to = ['hybrid to Matson']
                        route_from = ['Matson to Military']
                    else:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
    
                elif self.route == 'Marathon Transit Area Hybrid-Marathon Transit Area Hybrid':
                    if destination == 1:
                        route_to = ['hybrid to Matson']
                        route_from = ['hybrid to Matson']
                    else:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
    
                elif self.route == 'Military-Marathon Transit Area Hybrid':
                    if destination == 1:
                        route_to = ['Matson to Military']
                        route_from = ['hybrid to Matson']
                    else:
                        route_to = ['Tote to Military']
                        route_from = ['hybrid to Tote']
    
                elif self.route == 'Military-Military':
                    if destination == 1:
                        route_to = ['Matson to Military']
                        route_from = ['Matson to Military']
                    else:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
    
                elif self.route == 'Tidewater-Tidewater':
                    if destination == 1:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson through Tidewater']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson through Tidewater']
                    else:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
    
                elif self.route == 'PetroStar-Tidewater':
                    if destination == 1:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','PetroStar','PetroStar to Matson']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson through Tidewater']
                    else:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
    
                elif self.route == 'Tidewater-PetroStar':
                    if destination == 1:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson through Tidewater']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','PetroStar','PetroStar to Matson']
                    else:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
    
            elif self.block == 'Section 8':
                if self.route == 'Tidewater-Tidewater':
                    if destination == 1:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson through Tidewater']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Matson through Tidewater']
                    else:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
    
                elif self.route == 'Marathon Transit Area Hybrid-Military':
                    if destination == 1:
                        route_to = ['hybrid to Matson']
                        route_from = ['Matson to Military']
                    else:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
    
                elif self.route == 'Marathon Transit Area Hybrid-Marathon Transit Area Hybrid':
                    if destination == 1:
                        route_to = ['hybrid to Matson']
                        route_from = ['hybrid to Matson']
                    else:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
    
                elif self.route == 'Military-Marathon Transit Area Hybrid':
                    if destination == 1:
                        route_to = ['Matson to Military']
                        route_from = ['hybrid to Matson']
                    else:
                        route_to = ['Tote to Military']
                        route_from = ['hybrid to Tote']
    
                elif self.route == 'Military-Military':
                    if destination == 1:
                        route_to = ['Matson to Military']
                        route_from = ['Matson to Military']
                    else:
                        route_to = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
                        route_from = ['Ocean to Gate','Gate to First Fork','First Fork to Second Fork','Second Fork to Tote']
    
            elif self.block == 'Section 9':
                if destination == 1:
                    route_to = init_to_matson
                    route_from = init_from_matson
                else:
                    route_to = init_to_tote
                    route_from = init_from_tote
    
            elif self.block == 'None':
                if destination == 1:
                    route_to = init_to_matson
                    route_from = init_from_matson
                else:
                    route_to = init_to_tote
                    route_from = init_from_tote
    
            # finally, check if the chosen route still contains the blocked segment
            blocked_segment = blockage_segments.get(self.block, None)
            if blocked_segment is not None:
                if blocked_segment in route_to or blocked_segment in route_from:
                    raise ValueError("Detour route still includes blocked segment! Define a better alternate route.")
    
            return route_to, route_from
            
    def _move_along_route(self, segments, total_time_container):
        total_time = 0
        for seg in segments:
            if self._is_blocked(seg):
                now_t = self.env.now
                if self.block_start <= now_t < self.block_end:
                    delay = self.block_end - now_t
                    yield self.env.timeout(delay)
            seg_time = self._transportation_time(seg)
            yield self.env.timeout(seg_time)
            total_time += seg_time
        total_time_container[0] = total_time

    def _is_blocked(self, seg):
        if self.block not in self.block_map:
            return False
        return seg == self.block_map[self.block]

    def _transportation_time(self, seg):
        standard_travel_times = {
            'Ocean to Gate': 0.26 * 3600 / 20,
            'Insulfoam to Gate': 0.45 * 3600 / 15,
            'Gate to First Fork': 0.18 * 3600 / 20,
            'First Fork to Second Fork': 0.14 * 3600 / 20,
            'First Fork to Second Fork through ABI': 0.54 * 3600 / 15,
            'First Fork to Matson through ABI': 0.65 * 3600 / 10,
            'Bluff to first fork': 1.9 * 3600 / 20,
            'Tote to Military': 0.6 * 3600 / 20,
            'hybrid to Matson': 1.23 * 3600 / 15,
            'hybrid to Tote': 1.75 * 3600 / 15,
            'Roger': 0.2 * 3600 / 15,
            'Roger to Tote': 0.68 * 3600 / 20,
            'Roger to Matson': 0.48 * 3600 / 20,
            'PetroStar': 0.1 * 3600 / 5,
            'PetroStar to Matson': 0.3 * 3600 / 20,
            'Second Fork to Tote through Transit': 0.71 * 3600 / 15,
            'Matson to Military': 0.67 * 3600 / 20,
            'Marathon to Matson': 1.07 * 3600 / 15,
            'Marathon to second Fork': 0.8 * 3600 / 15,
            'First Fork to Tote through Roger Graves Rd': 0.83 * 3600 / 20,
            'Second Fork to Matson': 0.4 * 3600 / 20,
            'Second Fork to Matson through Tidewater': 0.4 * 3600 / 15,
            'Second Fork to Tote': 0.7 * 3600 / 20
        }

        seg_time = standard_travel_times.get(seg, 0.0)
        now_sec = self.env.now
        hour = (now_sec // 3600) % 24
        day_of_year = (now_sec // 86400) % 365
        month_index = (day_of_year // 30) + 1
        is_night = (hour >= 19 or hour <= 7)

        month_time_factors = {
            1: 1.10, 2: 1.10, 3: 1.05, 4: 1.00,
            5: 0.90, 6: 0.80, 7: 0.80, 8: 0.80,
            9: 0.90, 10: 1.00, 11: 1.05, 12: 1.10
        }
        seg_time *= month_time_factors.get(month_index, 1.0)
        if is_night:
            seg_time *= 1.1
        return seg_time

###############################################################################
#                           CUSTOM ENVIRONMENT CLASS                          #
###############################################################################
class CustomEnvironment:
    """
    Wraps a simpy.Environment along with global statistics and resource references.
    """

    def __init__(self, block, block_start, block_end, scenario):
        self.env = simpy.Environment()
        self.check_in = simpy.Resource(self.env, capacity=1)
        self.Marathon_gate = simpy.Resource(self.env, capacity=1)
        self.hazmat_lane = simpy.Resource(self.env, capacity=1)
        self.block = block
        self.block_start = block_start
        self.block_end = block_end
        self.scenario = scenario
        self.waiting_times = []
        self.cycle_times = []
        self.all_results = []
        self.hazmat_waits = []
        self.num_of_hazmat = 0
        self.env.parent_env = self

    def add_vehicle(self, name, arrival_time, vehicle_type, route):
        v = Vehicle(self.env, name, vehicle_type,
                    self.check_in, self.Marathon_gate, self.hazmat_lane,
                    self.block, route, self.block_start, self.block_end,
                    self.scenario, arrival_time)
        self.env.process(v.run())

###############################################################################
#                             SCENARIO RUNNER CLASS                           #
###############################################################################
class ScenarioRunner:
    """
    Orchestrates simulation runs for three scenarios (normal, no_reaction, detour)
    and produces outputs similar to the old code.
    """
    block_possible_routes = {
        'Section 1': [
            'Insulfoam-Insulfoam','Insulfoam-Military','Military-Insulfoam','Military-Military'
        ],
        'Section 2': [
            'Marathon-Military','Marathon-Marathon','Military-Marathon','Military-Military',
            'Bluff-Marathon','Marathon-Bluff','Bluff-Military','Military-Bluff','Bluff-Bluff',
            'Marathon Transit Area Hybrid-Marathon Transit Area Hybrid'
        ],
        'Section 3': [
            'Marathon Transit Area Hybrid-Marathon Transit Area Hybrid','Marathon Transit Area Hybrid-Military',
            'Military-Marathon Transit Area Hybrid','Military-Military'
        ],
        'Section 4': [
            'ABI-Roger','Roger-ABI','ABI-ABI','Roger-Roger','ABI-Military','Military-ABI',
            'Military-Military','Marathon Transit Area Hybrid-Marathon Transit Area Hybrid'
        ],
        'Section 5': [
            'Military-Military','Roger-Military','Military-Roger'
        ],
        'Section 6': [
            'Transit-Transit','Military-Military'
        ],
        'Section 7': [
            'Marathon Transit Area Hybrid-Military','Marathon Transit Area Hybrid-Marathon Transit Area Hybrid',
            'Military-Marathon Transit Area Hybrid','Military-Military','Tidewater-Tidewater',
            'PetroStar-Tidewater','Tidewater-PetroStar'
        ],
        'Section 8': [
            'Tidewater-Tidewater','Marathon Transit Area Hybrid-Military',
            'Marathon Transit Area Hybrid-Marathon Transit Area Hybrid','Military-Marathon Transit Area Hybrid',
            'Military-Military'
        ],
        'Section 9': [
            'Tidewater-Tidewater'
        ]
    }

    def __init__(self, excel_file_trucks, excel_file_cars,
                 block_location, route, block_type, block_date, block_hour):
        self.excel_file_trucks = excel_file_trucks
        self.excel_file_cars   = excel_file_cars
        self.block_location    = block_location
        self.route             = route
        self.block_type        = block_type
        self.block_date        = block_date
        self.block_hour        = block_hour

        # [DEBUG] Show the parameters
        #print(f"[DEBUG] ScenarioRunner init -> "
        #      f"Trucks file: {excel_file_trucks}, Cars file: {excel_file_cars}, "
        #      f"block_location: {block_location}, route: {route}, "
        #      f"block_type: {block_type}, block_date: {block_date}, block_hour: {block_hour}")

        self.df_normal     = pd.DataFrame()
        self.df_noreaction = pd.DataFrame()
        self.df_detour     = pd.DataFrame()

    def _create_environment(self, scenario):
        # [DEBUG]
        #print(f"[DEBUG] _create_environment -> scenario: {scenario}, block_location: {self.block_location}")

        if not self.block_location or self.block_location == 'None':
            block_duration = 0
        else:
            if self.block_type == 'short':
                block_duration = random.randint(30*60, 60*60)
            elif self.block_type == 'medium':
                block_duration = random.randint(61*60, 120*60)
            else:
                block_duration = random.randint(121*60, 240*60)

        block_start = 0
        block_end = block_start + block_duration

        # [DEBUG]
        #print(f"[DEBUG] block_duration: {block_duration}, block_start: {block_start}, block_end: {block_end}")

        cenv = CustomEnvironment(self.block_location, block_start, block_end, scenario)

        # [DEBUG] Instantiating traffic generators
        #print(f"[DEBUG] Creating TrafficDataGenerator for trucks: {self.excel_file_trucks}")
        gen_trucks = TrafficDataGenerator(self.excel_file_trucks)
        #print(f"[DEBUG] Creating TrafficDataGenerator for cars: {self.excel_file_cars}")
        gen_cars = TrafficDataGenerator(self.excel_file_cars)

        truck_arrs = gen_trucks.generate_cumulative_arrivals(block_duration, self.block_date, self.block_hour)
        car_arrs = gen_cars.generate_cumulative_arrivals(block_duration, self.block_date, self.block_hour)

        # [DEBUG] Print the number of arrivals
        #print(f"[DEBUG] scenario='{scenario}' -> #Trucks: {len(truck_arrs)}, #Cars: {len(car_arrs)}")

        for i, t_arr in enumerate(truck_arrs):
            cenv.add_vehicle(f"Truck {i+1}", t_arr, "Truck", self.route)
        for i, c_arr in enumerate(car_arrs):
            cenv.add_vehicle(f"Car {i+1}", c_arr, "Car", self.route)

        return cenv, block_duration

    def run_normal_scenario(self):
        saved_block = self.block_location
        self.block_location = None  # no block for normal
        cenv, blk_dur = self._create_environment('normal')
        self.block_location = saved_block

        # [DEBUG]
        #print("[DEBUG] run_normal_scenario -> environment run for 7200*3 seconds")

        cenv.env.run(until=7200*3)
        df = pd.DataFrame(cenv.all_results)
        #print(f"[DEBUG] run_normal_scenario -> #results in df: {df.shape[0]}")
        return df, cenv

    def run_no_reaction_scenario(self):
        cenv, blk_dur = self._create_environment('no_reaction')
        # [DEBUG]
        #print(f"[DEBUG] run_no_reaction_scenario -> environment run for (blk_dur + 7200) = {blk_dur + 7200} seconds")

        cenv.env.run(until=blk_dur + 7200)
        df = pd.DataFrame(cenv.all_results)
        #print(f"[DEBUG] run_no_reaction_scenario -> #results in df: {df.shape[0]}")
        return df, cenv

    def run_detour_scenario(self):
        cenv, blk_dur = self._create_environment('detour')
        # [DEBUG]
        #print(f"[DEBUG] run_detour_scenario -> environment run for (blk_dur + 7200) = {blk_dur + 7200} seconds")

        cenv.env.run(until=blk_dur + 7200)
        df = pd.DataFrame(cenv.all_results)
        #print(f"[DEBUG] run_detour_scenario -> #results in df: {df.shape[0]}")
        return df, cenv
        
    def run_all_scenarios(self):
        #print("[DEBUG] run_all_scenarios -> starting NORMAL scenario")
        df_norm, env_norm = self.run_normal_scenario()
        self.df_normal = df_norm

        #print("[DEBUG] run_all_scenarios -> starting NO_REACTION scenario")
        df_nr, env_nr = self.run_no_reaction_scenario()
        self.df_noreaction = df_nr

        #print("[DEBUG] run_all_scenarios -> starting DETOUR scenario")
        df_det, env_det = self.run_detour_scenario()
        self.df_detour = df_det
    
        norm_wait = np.array(env_norm.waiting_times) / 60 if env_norm.waiting_times else np.array([])
        norm_cycle = np.array(env_norm.cycle_times) / 60 if env_norm.cycle_times else np.array([])
        nr_wait = np.array(env_nr.waiting_times) / 60 if env_nr.waiting_times else np.array([])
        nr_cycle = np.array(env_nr.cycle_times) / 60 if env_nr.cycle_times else np.array([])
        det_wait = np.array(env_det.waiting_times) / 60 if env_det.waiting_times else np.array([])
        det_cycle = np.array(env_det.cycle_times) / 60 if env_det.cycle_times else np.array([])
    
        # [DEBUG] Print some stats
        #print(f"[DEBUG] Normal scenario: #waiting_times={len(env_norm.waiting_times)}, #cycle_times={len(env_norm.cycle_times)}")
        #print(f"[DEBUG] NoReaction scenario: #waiting_times={len(env_nr.waiting_times)}, #cycle_times={len(env_nr.cycle_times)}")
        #print(f"[DEBUG] Detour scenario: #waiting_times={len(env_det.waiting_times)}, #cycle_times={len(env_det.cycle_times)}")

        norm_metrics = {
            'Scenario': 'Normal',
            'Avg Waiting (min)': np.mean(norm_wait) if norm_wait.size > 0 else 0,
            'Max Waiting (min)': np.max(norm_wait) if norm_wait.size > 0 else 0,
            'Avg Cycle (min)': np.mean(norm_cycle) if norm_cycle.size > 0 else 0,
            'Max Cycle (min)': np.max(norm_cycle) if norm_cycle.size > 0 else 0
        }
        nr_metrics = {
            'Scenario': 'No Reaction',
            'Avg Waiting (min)': np.mean(nr_wait) if nr_wait.size > 0 else 0,
            'Max Waiting (min)': np.max(nr_wait) if nr_wait.size > 0 else 0,
            'Avg Cycle (min)': np.mean(nr_cycle) if nr_cycle.size > 0 else 0,
            'Max Cycle (min)': np.max(nr_cycle) if nr_cycle.size > 0 else 0
        }
        det_metrics = {
            'Scenario': 'Detour',
            'Avg Waiting (min)': np.mean(det_wait) if det_wait.size > 0 else 0,
            'Max Waiting (min)': np.max(det_wait) if det_wait.size > 0 else 0,
            'Avg Cycle (min)': np.mean(det_cycle) if det_cycle.size > 0 else 0,
            'Max Cycle (min)': np.max(det_cycle) if det_cycle.size > 0 else 0
        }
        summary_df = pd.DataFrame([norm_metrics, nr_metrics, det_metrics])
        
        waits_tuple = (env_norm.waiting_times, env_nr.waiting_times, env_det.waiting_times)
        cycles_tuple = (env_norm.cycle_times, env_nr.cycle_times, env_det.cycle_times)
        
        return summary_df, waits_tuple, cycles_tuple
    
    def compare_routes_for_block(self):
        # [DEBUG]
        #print(f"[DEBUG] compare_routes_for_block -> block_location: {self.block_location}")

        if self.block_location not in self.block_possible_routes:
            #print("[DEBUG] No possible routes found for this block.")
            return pd.DataFrame()

        routes = self.block_possible_routes[self.block_location]
        results = []
        for alt_route in routes:
            saved_route = self.route
            self.route = alt_route

            #print(f"[DEBUG] compare_routes_for_block -> Trying route: {alt_route}")
            cenv, blk_dur = self._create_environment('detour')
            cenv.env.run(until=blk_dur + 7200)

            w = cenv.waiting_times
            c = cenv.cycle_times
            row = {
                'Route': alt_route,
                'Avg Waiting Time': np.mean(w)/60 if w else 0, 
                'Max Waiting Time': np.max(w)/60 if w else 0,
                'Avg Cycle Time': np.mean(c)/60 if c else 0,         
                'Max Cycle Time': np.max(c)/60 if c else 0
            }
            results.append(row)
            self.route = saved_route

        return pd.DataFrame(results)

        
    def plot_boxplots(self, waits_tuple, cycles_tuple):
        #print("[DEBUG] plot_boxplots -> Generating box plots.")

        norm_wait, nr_wait, det_wait = waits_tuple
        norm_cycle, nr_cycle, det_cycle = cycles_tuple
    
        normal_waiting = np.array(norm_wait) / 60 if norm_wait else []
        no_reaction_waiting = np.array(nr_wait) / 60 if nr_wait else []
        detour_waiting = np.array(det_wait) / 60 if det_wait else []
        
        normal_cycle_min = np.array(norm_cycle) / 60 if norm_cycle else []
        no_reaction_cycle_min = np.array(nr_cycle) / 60 if nr_cycle else []
        detour_cycle_min = np.array(det_cycle) / 60 if det_cycle else []
    
        fig, axes = plt.subplots(1, 2, figsize=(12, 6))
        
        # Waiting Times
        axes[0].boxplot(
            normal_waiting,
            positions=[1],
            widths=0.6,
            showmeans=True,
            whis=1.5,
            patch_artist=True
        )
        axes[0].boxplot(
            no_reaction_waiting,
            positions=[2],
            widths=0.6,
            showmeans=True,
            whis=1.5,
            patch_artist=True
        )
        axes[0].boxplot(
            detour_waiting,
            positions=[3],
            widths=0.6,
            showmeans=True,
            whis=1.5,
            patch_artist=True
        )
        
        axes[0].set_xticks([1, 2, 3])
        axes[0].set_xticklabels(['Normal', 'No Reaction', 'Detour'])
        axes[0].set_title('Waiting Times (min)')
        axes[0].set_ylabel('Minutes')   

        # Cycle Times
        axes[1].boxplot(
            normal_cycle_min,
            positions=[1],
            widths=0.6,
            showmeans=True,
            whis=1.5,
            patch_artist=True
        )
        axes[1].boxplot(
            no_reaction_cycle_min,
            positions=[2],
            widths=0.6,
            showmeans=True,
            whis=1.5,
            patch_artist=True
        )
        axes[1].boxplot(
            detour_cycle_min,
            positions=[3],
            widths=0.6,
            showmeans=True,
            whis=1.5,
            patch_artist=True
        )
        
        axes[1].set_xticks([1, 2, 3])
        axes[1].set_xticklabels(['Normal', 'No Reaction', 'Detour'])
        axes[1].set_title('Cycle Times (Trucks only) (min)')
        axes[1].set_ylabel('Minutes')
        
        plt.tight_layout()
        plt.show()

    def save_json_data(self, waits_tuple, cycles_tuple):
        root_path = os.environ.get('BASE_PATH')
        if not root_path:
            #print("[DEBUG] save_json_data -> BASE_PATH not set! Cannot save JSON files.")
            return

        norm_wait, nr_wait, det_wait = waits_tuple
        norm_cycle, nr_cycle, det_cycle = cycles_tuple

        waiting_data = {
            "Normal": list(map(float, norm_wait)),
            "No Reaction": list(map(float, nr_wait)),
            "Detour": list(map(float, det_wait))
        }
        waiting_data_path = root_path + "/scenarioanalysis/data/waiting_data_short.json"

        cycle_data = {
            "Normal": list(map(float, norm_cycle)),
            "No Reaction": list(map(float, nr_cycle)),
            "Detour": list(map(float, det_cycle))
        }
        cycle_data_path = root_path + "/scenarioanalysis/data/cycle_data_short.json"

        df_norm = self.df_normal.copy()
        df_norm['Scenario'] = 'Normal'
        df_nr = self.df_noreaction.copy()
        df_nr['Scenario'] = 'No Reaction'
        df_det = self.df_detour.copy()
        df_det['Scenario'] = 'Detour'
        combined_df = pd.concat([df_norm, df_nr, df_det], ignore_index=True)
        recs = combined_df.to_dict(orient='records')
        #results_json_path = root_path + "/scenarioanalysis/data/simulation_results_short.json"

        # [DEBUG] Show final JSON file paths
        #print(f"[DEBUG] save_json_data -> writing waiting_data to: {waiting_data_path}")
        #print(f"[DEBUG] save_json_data -> writing cycle_data to: {cycle_data_path}")
        #print(f"[DEBUG] save_json_data -> writing results_json to: {results_json_path}")

        with open(waiting_data_path, "w") as f:
            json.dump(waiting_data, f, indent=4)

        with open(cycle_data_path, "w") as f:
            json.dump(cycle_data, f, indent=4)

        #with open(results_json_path, "w") as f:
        #    json.dump(recs, f, indent=4)

    def run(self):
        vid_while, vid_after = VideoLinkManager.get_video_links(self.block_location, self.route)
        print("[DEBUG] run -> Video link during simulation:", vid_while)
        print("[DEBUG] run -> Video link after simulation:", vid_after)

        summary_df, waits_tuple, cycles_tuple = self.run_all_scenarios()

        print("\n--- Scenarios Summary ---")
        print(summary_df.to_string(index=False))

        self.plot_boxplots(waits_tuple, cycles_tuple)
        self.save_json_data(waits_tuple, cycles_tuple)
        print("JSON files saved: waiting_data_short.json, cycle_data_short.json, simulation_results_short.json")

        root_path = os.environ.get('BASE_PATH')
        if self.block_location in self.block_possible_routes:
            df_cmp = self.compare_routes_for_block()
            if not df_cmp.empty:
                print("\n--- Compare possible routes (Detour) for block:", self.block_location, "---")
                print(df_cmp.to_string(index=False))
                cmp_records = df_cmp.to_dict(orient='records')
                cmp_json_path = root_path + "/scenarioanalysis/data/simulation_results_short.json"
                with open(cmp_json_path, "w") as f:
                    json.dump(cmp_records, f, indent=4)
                print("compare_routes.json saved.")
            else:
                print("No alternative routes found for block:", self.block_location)

        print("\n--- End of run ---")
